import io
import numpy as np
import noisereduce as nr
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pydub import AudioSegment
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB limit

ALLOWED_EXTENSIONS = {'wav'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def normalise(audio):
    samples = np.array(audio.get_array_of_samples())
    
    if audio.sample_width == 1:
        samples = samples.astype(np.float32)
        samples = (samples - 128.0) / 128.0
        
    elif audio.sample_width == 2:
        samples = samples.astype(np.float32)
        samples /= 32768.0
        
    elif audio.sample_width == 4:
        samples = samples.astype(np.float32)
        samples /= 2147483648.0
    
    # what about 24-bit?

    else:
        raise ValueError(f"Unsupported bit depth: {audio.sample_width * 8}-bit")

    return samples

def denormalise(float_samples, sample_width=2):
    float_samples = np.array(float_samples, dtype=np.float32)
    float_samples = np.nan_to_num(float_samples)

    if sample_width == 1:
        scaled = (float_samples * 127.0) + 128.0
        return np.clip(scaled, 0, 255).astype(np.uint8)

    elif sample_width == 2:
        scaled = float_samples * 32768.0
        return np.clip(scaled, -32768, 32767).astype(np.int16)

    elif sample_width == 4:
        scaled = float_samples * 2147483648.0
        return np.clip(scaled, -2147483648, 2147483647).astype(np.int32)

    else:
        raise ValueError("Unsupported sample width. Use 1, 2, or 4.")

@app.route('/process-audio', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return "No file", 400
    
    file = request.files['file']
    if file.filename == '':
        return "No file", 400
    
    if not allowed_file(file.filename):
        return "Invalid file type. Only WAV files are supported.", 400

    try:
        audio = AudioSegment.from_file(file)
        samples = normalise(audio)
        
        if audio.channels == 2:
            samples = samples.reshape((-1, 2)).T
        
        max_val_before = np.max(np.abs(samples))

        # this part can be better implemented, 
        # maybe asking the user to select the noise clip from the audio
        # or using a noise floor estimation?
        # noise_clip = samples[0:10000]

        reduced_noise = nr.reduce_noise(y=samples, sr=audio.frame_rate, stationary=True, prop_decrease=.8)

        max_val_after = np.max(np.abs(reduced_noise))

        if max_val_after > 0.01:
            makeup_gain = max_val_before / max_val_after
            reduced_noise = reduced_noise * makeup_gain
        
        plot_samples = samples.T if samples.ndim > 1 else samples
        plot_reduced = reduced_noise.T if reduced_noise.ndim > 1 else reduced_noise

        fig_orig, ax_orig = plt.subplots(figsize=(20, 4))
        ax_orig.plot(plot_samples)
        ax_orig.set_title("Original")
        original_image = io.BytesIO()
        fig_orig.savefig(original_image, format='png')
        plt.close(fig_orig)
        original_image.seek(0)

        fig_red, ax_red = plt.subplots(figsize=(20, 4))
        ax_red.plot(plot_reduced)
        ax_red.set_title("Reduced Noise")
        reduced_image = io.BytesIO()
        fig_red.savefig(reduced_image, format='png')
        plt.close(fig_red)
        reduced_image.seek(0)

        cleaned_samples = denormalise(reduced_noise, audio.sample_width)

        if audio.channels == 2:
            cleaned_samples = cleaned_samples.T.flatten()

        cleaned_audio = audio._spawn(cleaned_samples.tobytes())
        
        out_buffer = io.BytesIO()
        cleaned_audio.export(out_buffer, format="wav")
        out_buffer.seek(0)
        
        original_image_base64 = base64.b64encode(original_image.getvalue()).decode('utf-8')
        reduced_image_base64 = base64.b64encode(reduced_image.getvalue()).decode('utf-8')
        audio_base64 = base64.b64encode(out_buffer.getvalue()).decode('utf-8')

        original_image.close()
        reduced_image.close()
        out_buffer.close()

        return jsonify({
            'original_image': original_image_base64,
            'reduced_image': reduced_image_base64,
            'audio': audio_base64
        })

    except Exception as e:
        print(f"Error: {e}")
        return str(e), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)