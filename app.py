import dash
import dash_html_components as html
from flask import Flask, render_template, jsonify
from data.load_data import *
import json

# declaring the flask app
server = Flask(__name__)

# initial route
@server.route('/')
def index():
    data = load_data()
    print(data)
    return render_template('dashboard_view.html',
                           data=data)

#route with the data
@server.route('/data')
def data():
    data = load_data()
    return jsonify(data)


# TODO: implement dash and dash route
# app = dash.Dash(
#     __name__,
#     server=server,
#     routes_pathname_prefix='/dash/'
# )
#
# app.layout = html.Div("My Dash app")

server.run(debug=True)