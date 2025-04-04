from flask import *
from api.attraction.getlist import attractions_bp
from api.attraction.idgetlist import attraction_bp 
from api.user.user import user_bp
from api.booking.booking import booking_bp
from api.order.order import order_bp
from api.user.password import password_bp

app=Flask(__name__,template_folder='templates',static_folder='static')
app.config.from_object('config.DevConfig')
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False

app.register_blueprint(attractions_bp)
app.register_blueprint(attraction_bp)
app.register_blueprint(user_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(order_bp)
app.register_blueprint(password_bp)

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
@app.route("/member")
def member():
	return render_template("member.html")

if __name__=="__main__":
	# print(app.url_map)
	app.run(host="0.0.0.0",port=3000)