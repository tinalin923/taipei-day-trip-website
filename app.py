from flask import *
from attractions.getlist import attractions_bp
from attractions.idgetlist import attraction_bp 


app=Flask(__name__)
app.config.from_object('config.DevConfig')
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False

app.register_blueprint(attractions_bp)
app.register_blueprint(attraction_bp)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

if __name__=="__main__":
	print(app.url_map)
	app.run(host="34.195.43.91",port=3000)