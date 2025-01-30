from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key, load_pem_public_key
from cryptography.exceptions import InvalidSignature
import PyPDF2
import io
import os

def generate_keys():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    public_key = private_key.public_key()

    # Serialize private key
    pem_private = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    # Serialize public key
    pem_public = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    # Write keys to files
    with open("private_key.pem", "wb") as f:
        f.write(pem_private)
    with open("public_key.pem", "wb") as f:
        f.write(pem_public)

def ensure_keys_exist():
    if not os.path.exists("private_key.pem") or not os.path.exists("public_key.pem"):
        generate_keys()

def sign_pdf(pdf_path, output_path, private_key_path):
    ensure_keys_exist()
    # Load the private key
    with open(private_key_path, "rb") as key_file:
        private_key = load_pem_private_key(key_file.read(), password=None)

    # Read the PDF
    with open(pdf_path, "rb") as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        pdf_writer = PyPDF2.PdfWriter()

        for page in pdf_reader.pages:
            pdf_writer.add_page(page)

        # Create a signature
        pdf_bytes = io.BytesIO()
        pdf_writer.write(pdf_bytes)
        pdf_bytes.seek(0)

        signature = private_key.sign(
            pdf_bytes.getvalue(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )

        # Add the signature to the PDF metadata
        pdf_writer.add_metadata({
            "/Signature": signature.hex()
        })

        # Write the signed PDF
        with open(output_path, "wb") as output_file:
            pdf_writer.write(output_file)

def verify_signature(pdf_path, public_key_path):
    ensure_keys_exist()
    # Load the public key
    with open(public_key_path, "rb") as key_file:
        public_key = load_pem_public_key(key_file.read())

    # Read the PDF
    with open(pdf_path, "rb") as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        # Get the signature from metadata
        signature = bytes.fromhex(pdf_reader.metadata.get("/Signature", ""))

        # Verify the signature
        try:
            public_key.verify(
                signature,
                pdf_file.read(),
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            return True
        except InvalidSignature:
            return False

