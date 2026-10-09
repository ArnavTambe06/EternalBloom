import qrcode

url = "https://eternal-bloom-delta.vercel.app/"

qr = qrcode.make(url)

qr.save("eternal_bloom.png")

print("QR code generated successfully!")