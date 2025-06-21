# Style Snap: A Virtual Wardrobe Experience 👗✨

**A culturally inclusive virtual try-on system for traditional Pakistani and Eastern attire**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-Lightning-red.svg)](https://pytorch.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🌟 Overview

Style Snap is an advanced virtual try-on system built upon the StableVITON framework, specifically fine-tuned for traditional Pakistani and Eastern clothing. The system addresses a significant gap in current virtual try-on solutions by providing culturally inclusive experiences for traditional garments like kurtas, lawns, and traditional dresses.

### Key Features

- **Cultural Focus**: Specialized for Pakistani and Eastern traditional attire
- **Full Body Support**: Handles both upper and lower body garments
- **High Fidelity**: Enhanced geometric precision and visual realism
- **Advanced AI**: Built on StableVITON with custom improvements
- **User-Friendly**: Intuitive interface for easy virtual try-on experiences

## 🎯 Problem Solved

Current virtual try-on systems primarily focus on Western clothing, leaving a significant gap for traditional Eastern attire. Style Snap bridges this gap by:

- Providing realistic virtual try-on for kurtas, lawns, and traditional dresses
- Maintaining cultural authenticity in garment representation
- Offering high-quality results with improved geometric alignment
- Supporting diverse body poses and garment styles

## 🏗️ Architecture

The system consists of three primary modules:

1. **Segmentation Module**: Generates agnostic person images and garment masks
2. **Cross-Attention Warper**: Aligns garments to target poses using latent-space warping
3. **Diffusion Generator**: Synthesizes final images with attention to realism

## 🚀 Performance Metrics

Our model achieves impressive results on traditional Eastern garments:

| Metric              | Value | Description             |
| ------------------- | ----- | ----------------------- |
| **FID Score**       | 8.50  | Overall image quality   |
| **CLIP Similarity** | 0.88  | Semantic fidelity       |
| **DensePose IoU**   | 0.82  | Body alignment accuracy |
| **Parsing mIoU**    | 0.78  | Segmentation quality    |
| **Keypoint Error**  | 4.2px | Pose preservation       |

## 📋 Requirements

### Hardware Requirements

- **GPU**: NVIDIA RTX 3090 Ti or equivalent (recommended)
- **RAM**: 64GB DDR4 (minimum 32GB)
- **CPU**: Intel Core i9-11900K or equivalent
- **Storage**: 50GB+ free space

### Software Requirements

- Python 3.8+
- PyTorch Lightning
- CUDA 11.0+
- OpenPose
- Detectron2
- Additional dependencies in `requirements.txt`

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ahmedmst2423/StableVITONApp.git
   cd StableVITONApp
   ```

2. **Create virtual environment**

   ```bash
   python -m venv style_snap_env
   source style_snap_env/bin/activate  # On Windows: style_snap_env\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Download pretrained models**

   ```bash
   # Download OpenPose models
   python scripts/download_openpose_models.py

   # Download StableVITON checkpoint
   python scripts/download_stable_viton.py
   ```

5. **Setup configuration**
   ```bash
   cp config/config.example.yaml config/config.yaml
   # Edit config.yaml with your settings
   ```

## 📱 Usage

### For End Users

1. **Launch the application**

   ```bash
   python app.py
   ```

2. **Upload your image**

   - Use the web interface to upload a clear, full-body image
   - Ensure good lighting and clear visibility of the person

3. **Select garments**

   - Browse through the catalog of traditional Eastern clothing
   - Filter by style, color, and region
   - Preview selections in real-time

4. **Generate try-on**
   - Click "Try On" to generate the virtual fitting
   - Download results or share with others

### For Developers

```python
from style_snap import VirtualTryOn

# Initialize the model
model = VirtualTryOn.load_from_checkpoint('path/to/checkpoint')

# Perform virtual try-on
result = model.try_on(
    person_image='path/to/person.jpg',
    garment_image='path/to/garment.jpg'
)

# Save result
result.save('output/try_on_result.jpg')
```

## 🎨 Dataset

The model is trained on a custom-curated dataset featuring:

- **Sources**: Limelight, Mohagni, MTJ, Junaid Jamshed
- **Categories**: Kurtas, dresses, casual wear, traditional lawns
- **Quality**: High-resolution images with diverse poses and styles
- **Cultural Focus**: Authentic Pakistani and Eastern garments

## 🔧 Training

To fine-tune the model on your own dataset:

```bash
python train.py \
    --config config/train_config.yaml \
    --data_path /path/to/your/dataset \
    --epochs 100 \
    --batch_size 4 \
    --learning_rate 1e-4
```

## 📊 Evaluation

Run evaluation on test dataset:

```bash
python evaluate.py \
    --checkpoint path/to/model.ckpt \
    --test_data path/to/test/data \
    --output_dir results/
```

## 🤝 For Service Providers

The system includes a service provider portal for:

- **Secure garment uploads** with metadata tagging
- **Analytics dashboard** showing try-on frequency
- **Category management** (style, color, region filters)
- **Performance insights** for inventory optimization

## ⚠️ Known Limitations

- **Texture Blending**: Some residual blending between original and target textures
- **Complex Patterns**: Occasional ghosting with heavily patterned fabrics
- **Lighting Sensitivity**: Performance varies with image quality and lighting

## 🛣️ Future Improvements

- Enhanced garment-body disentanglement techniques
- Improved texture preservation methods
- Expanded dataset with more regional variations
- Mobile app development
- Real-time processing optimization

## 📝 Citation

If you use this work in your research, please cite:

```bibtex
@misc{stylesnap2025,
  title={Style Snap: A Virtual Wardrobe Experience for Traditional Eastern Attire},
  author={Ahmed Mustafa and Anwer Saeed and Shayan Anwar},
  year={2025},
  institution={FAST School of Computing, NUCES Karachi}
}
```

## 👥 Team

- **Ahmed Mustafa** (21K-3370) - Lead Developer
- **Anwer Saeed** (21K-3303) - AI/ML Engineer
- **Shayan Anwar** (21K-4836) - Data Engineer

**Supervisor**: Muhammad Nouman Durrani

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- StableVITON team for the foundational framework
- FAST School of Computing, NUCES Karachi
- Pakistani clothing brands for dataset contribution
- Open source community for various tools and libraries

## 📞 Support

For technical support or questions:

- Create an issue on GitHub
- Contact: ahmed.mustafa@example.com

---

**Made with ❤️ for preserving cultural fashion through technology**

![Logo](/assets/icon.png)
![App ScreenShot]("/assets/Try-on-image-1.png")
![App ScreenShot](/assets/Try-on-image-2.png)
![App Screenshot](/assets/Try-on-image-3.png)
