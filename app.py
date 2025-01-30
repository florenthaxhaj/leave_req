from flask import Flask, request, render_template, redirect, url_for, flash, send_file
from fpdf import FPDF
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
import os
from digital_signature import sign_pdf, verify_signature

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Add this line for flash messages

# Konfigurimi i lidhjes me MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client['pushimi_db']
collection = db['leave_requests']
#collection = db['kerkesat']

class PushimiPDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Kerkese per Pushim Vjetor', 0, 1, 'C')
    
    def chapter_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, 0, 1, 'L')
        self.ln(10)
    
    def chapter_body(self, body):
        self.set_font('Arial', '', 12)
        self.multi_cell(0, 10, body)
        self.ln()
        
    def create_pushimi_form(self, data):
        self.add_page()
        self.chapter_title('Info')
        self.chapter_body(
            f"Emri i punonjesit: {data.get('emri', 'N/A')}\n"
            f"Nr i ID se punonjesit: {data.get('id', 'N/A')}\n"
            f"Pozita: {data.get('pozita', 'N/A')}\n"
            f"Departamenti: {data.get('departamenti', 'N/A')}\n"
            f"Divizioni: {data.get('divizioni', 'N/A')}\n"
        )
        
        self.chapter_title('Pjesa e Parë: Kërkesa për Menaxherin Drejtpërdrejt')
        self.chapter_body(
            f"Kërkoj {data.get('dite_pushim', 'N/A')} ditë pushim vjetor për datën {data.get('data_fillimit', 'N/A')} deri më {data.get('data_mbarimit', 'N/A')}\n"
            f"Nënshkrimi i punonjësit: {data.get('nenshkrimi_punonjesit', 'N/A')} - Data: {data.get('data_nenshkrimit_punonjesit', 'N/A')}\n"
        )
        
        self.chapter_title('Pjesa e Dytë: Aprovimi nga Menaxheri')
        if data.get('aprovuari'):
            self.chapter_body(
                "A. Pushimi vjetor është miratuar sipas kërkesës së mësipërme\n"
                f"Nënshkrimi i menaxherit: {data.get('nenshkrimi_menaxherit', 'N/A')} - Data: {data.get('data_nenshkrimit_menaxherit', 'N/A')}\n"
                f"Nënshkrimi i drejtorit ekzekutiv: {data.get('nenshkrimi_drejtorit', 'N/A')} - Data: {data.get('data_nenshkrimit_drejtorit', 'N/A')}\n"
            )
        else:
            self.chapter_body(
                "B. Pushimi vjetor nuk aprovohet siç është kërkuar më lart\n"
                "Arsyet për refuzimin e kërkesës për pushim vjetor janë:\n"
                f"{data.get('arsyet_refuzimit', 'Nuk është dhënë arsye.')}\n"
                f"Nënshkrimi i menaxherit: {data.get('nenshkrimi_menaxherit', 'N/A')} - Data: {data.get('data_nenshkrimit_menaxherit', 'N/A')}\n"
            )
        
        self.chapter_title('Pjesa e Tretë: Për Menaxherin e Personelit')
        self.chapter_body(
            f"Ditet e mbetura nga viti paraprak: {data.get('ditet_mbetura_paraprak', 'N/A')}\n"
            f"Ditet e fituara nga viti aktual: {data.get('ditet_fituara_aktual', 'N/A')}\n"
            f"Të gjitha ditet e grumbulluara deri më tani: {data.get('ditet_grumbulluara', 'N/A')}\n"
            f"Ditet që do të shfrytëzohen: {data.get('ditet_shfrytezohen', 'N/A')}\n"
            f"Bilanci i mbetur: {data.get('bilanci', 'N/A')}\n"
            f"Vërtetuar dhe nënshkruar nga menaxheri i personelit: {data.get('nenshkrimi_personelit', 'N/A')} - Data: {data.get('data_personelit', 'N/A')}\n"
        )

# Sigurohuni që dosja pdfs ekziston
if not os.path.exists('pdfs'):
    os.makedirs('pdfs')

# Formulari për kërkesën e pushimit nga punonjësi
@app.route('/', methods=['GET', 'POST'])
def kerkese_pushimi():
    if request.method == 'POST':
        data = request.form.to_dict()
        data['aprovuari'] = False
        insert_result = collection.insert_one(data)  # Ruaj të dhënat në MongoDB dhe merr ID-n
        return redirect(url_for('aprovuari_menaxherit', _id=str(insert_result.inserted_id)))
    min_date = datetime.today().strftime('%Y-%m-%d')
    return render_template('kerkese_pushimi.html', min_date=min_date)

# Aprovimi nga menaxheri
@app.route('/aprovuari_menaxherit/<_id>', methods=['GET', 'POST'])
def aprovuari_menaxherit(_id):
    data = collection.find_one({"_id": ObjectId(_id)})
    if request.method == 'POST':
        updated_data = request.form.to_dict()
        updated_data['aprovuari'] = request.form.get('aprovuari') == 'True'
        if not updated_data['aprovuari']:
            if not updated_data.get('arsyet_refuzimit'):
                flash('Ju lutem jepni arsyet e refuzimit.', 'error')
                return render_template('aprovuari_menaxherit.html', data=data, min_date=datetime.today().strftime('%Y-%m-%d'))
        
        # Remove the '_id' field from updated_data
        updated_data.pop('_id', None)
        
        collection.update_one({"_id": ObjectId(_id)}, {"$set": updated_data})
        if updated_data['aprovuari']:
            return redirect(url_for('aprovuari_drejtorit', _id=_id))
        else:
            return redirect(url_for('shfaq_arsyet_refuzimit', _id=_id))
    min_date = datetime.today().strftime('%Y-%m-%d')
    return render_template('aprovuari_menaxherit.html', data=data, min_date=min_date)

# Aprovimi nga drejtori ekzekutiv
@app.route('/aprovuari_drejtorit/<_id>', methods=['GET', 'POST'])
def aprovuari_drejtorit(_id):
    data = collection.find_one({"_id": ObjectId(_id)})
    if request.method == 'POST':
        updated_data = request.form.to_dict()
        updated_data.pop('_id', None)  # Remove '_id' field if present
        collection.update_one({"_id": ObjectId(_id)}, {"$set": updated_data})
        return redirect(url_for('bilanci_personelit', _id=_id))
    min_date = datetime.today().strftime('%Y-%m-%d')
    return render_template('aprovuari_drejtorit.html', data=data, min_date=min_date)

# Bilanci nga menaxheri i personelit
@app.route('/bilanci_personelit/<_id>', methods=['GET', 'POST'])
def bilanci_personelit(_id):
    data = collection.find_one({"_id": ObjectId(_id)})
    if request.method == 'POST':
        updated_data = request.form.to_dict()
        updated_data.pop('_id', None)  # Remove '_id' field if present
        
        # Update the database with the new information
        collection.update_one({"_id": ObjectId(_id)}, {"$set": updated_data})
        
        # Fetch the updated data
        updated_full_data = collection.find_one({"_id": ObjectId(_id)})
        
        # Create PDF
        pdf = PushimiPDF()
        pdf.create_pushimi_form(updated_full_data)
        pdf_path = f'pdfs/kerkese_pushimi_vjetor_{_id}.pdf'
        pdf.output(pdf_path)
        
        # Sign the PDF
        signed_pdf_path = f'pdfs/kerkese_pushimi_vjetor_{_id}_signed.pdf'
        sign_pdf(pdf_path, signed_pdf_path, "private_key.pem")
        
        return send_file(signed_pdf_path, as_attachment=True)
    
    min_date = datetime.today().strftime('%Y-%m-%d')
    return render_template('bilanci_personelit.html', data=data, min_date=min_date)

@app.route('/verify_signature/<_id>')
def verify_signature_route(_id):
    pdf_path = f'pdfs/kerkese_pushimi_vjetor_{_id}_signed.pdf'
    if verify_signature(pdf_path, "public_key.pem"):
        return "Nënshkrimi dixhital është i vlefshëm!"
    else:
        return "Nënshkrimi dixhital nuk është i vlefshëm!"

@app.route('/shfaq_arsyet_refuzimit/<_id>')
def shfaq_arsyet_refuzimit(_id):
    data = collection.find_one({"_id": ObjectId(_id)})
    return render_template('shfaq_arsyet_refuzimit.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)

