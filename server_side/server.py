from flask import Flask
from flask import request, make_response, jsonify
from blueprint_auth import auth
from flask_mysqldb import MySQL
import json
import jwt

app =Flask(__name__)
app.register_blueprint(auth, url_prefix = "/auth")

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Kushal#025'
app.config['MYSQL_DB'] = 'movie'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

@app.route("/getmovies", methods = ["GET"])
def allmovies():
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM movies"""
    )
    results = cursor.fetchall()
    movie = []
    for m in results:
        movie.append(m)
    
    return jsonify({"movies":movie})

@app.route("/gettheatre", methods = ["POST"])
def theatre():
    mid = request.json['mid']
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT theatre.tid, theatre.tname, theatre.phone,theatre.lat, theatre.longitude FROM  theatre join movietheatre on movietheatre.tid = theatre.tid where movietheatre.mid = %s""", (,mid,)
    )
    results = cursor.fetchall()
    available_theatre = []
    for t in results:
        available_theatre.append(t)
    return jsonify({"theatres":available_theatre})

@app.route("/getscreen", methods = ["POST"])
def screen():
    tid = request.json['tid']
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM screen WHERE tid = %s""",(,tid)
    )
    results = cursor.fetchall()
    available_screen = []
    for t in results:
        available_screen.append(t)
    return jsonify({"screen":available_screen})

@app.route("/bookseat", methods = ['POST'])
def bookseat():
    screenid = request.json['screenid']
    seatid = request.json['seatid']
    mid = request.json['mid']
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'masai', algorithms=['HS256'])
    uid = str(decode_data['uid'])
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """UPDATE seats SET mid = %s, uid = %s, booked = 1 WHERE screenid = %s and seatid = %s""",
             (screenid,seatid)
            )
        mysql.connection.commit()
        return jsonify({"message": "seatbooked"})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()


@app.route('/categoryfilter',methods=['POST'])
def filterbyCategory():
    cid = request.json['cid']
    cursor = mysql.connection.cursor()
    if cid == "all":
        cursor.execute(
            """SELECT movies.mid, movies.mname, movies.cid,movies.language,category.cname from movies join category on category.cid = movies.cid"""
        )
    else:
        cursor.execute(
            """SELECT movies.mid, movies.mname,movies.language,category.cname from movies join category on category.cid = movies.cid where movies.cid = %s""",(cid)
        )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for i in results:
        items.append(i)
    return jsonify({"movies":items})

@app.route('/languagefilter',methods=['POST'])
def filterbylanguage():
    cursor = mysql.connection.cursor()
    language = request.json['language']
    if language == "all":
        allmovies()
    else:
        cursor.execute(
            """SELECT * FROM movies where language = % s""",(language)
        )
        results = cursor.fetchall()
        cursor.close()
        items = []
        for i in results:
            items.append(i)
        return jsonify({"movies":items})


@app.route("/emptyseats", methods = ['POST'])
def enptyseat():
    screenid = request.json['screenid']
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
                """SELECT distinct(seat_no),seatid,screenid,mid FROM seats where booked = 0 and screenid = %s""",(screenid)
            )
        results = cursor.fetchall()
        cursor.close()
        items = []
        for i in results:
            items.append(i)
        return jsonify({"seats":items})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()



    

