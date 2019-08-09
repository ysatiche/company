from flask import Flask, render_template, request, url_for
app = Flask(__name__)
from noverScratch import NoverScratch

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/search', methods=['POST', 'GET'])
def search():
  if request.method == 'POST':
    # print(request.form['searchUrl'])
    noverScratch = NoverScratch('')
    chapterName = noverScratch.writeTotalChapterToTxt(request.form['searchUrl'])
    # print(chapterName)
    if chapterName != -1:
      url_for('static', filename=chapterName)
  return render_template('index.html', novelName=chapterName)

if __name__ == '__main__':
  app.run(debug=True)