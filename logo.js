(() => {
  function chromaKeyToTransparent(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = frame.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i] > 235 && px[i + 1] > 235 && px[i + 2] > 235) px[i + 3] = 0;
    }
    ctx.putImageData(frame, 0, 0);
    img.src = canvas.toDataURL('image/png');
  }

  Array.from(document.querySelectorAll('img[data-chroma-key]')).forEach(img => {
    if (img.complete && img.naturalWidth) chromaKeyToTransparent(img);
    else img.addEventListener('load', () => chromaKeyToTransparent(img), { once: true });
  });
})();
