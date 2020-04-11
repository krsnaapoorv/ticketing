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
        """SELECT movies.mid,movies.mname,movies.language,movies.cid FROM movies join screen on movies.mid = screen.mid"""
    )
    results = cursor.fetchall()
    movie = []
    for m in results:
        movie.append(m)
    return jsonify({"movies":movie})

@app.route("/upcoming", methods = ["GET"])
def upcomingmovies():
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT movies.mid,movies.mname,movies.language,movies.cid FROM movies join screen on movies.mid != screen.mid"""
    )
    results = cursor.fetchall()
    movie = []
    for m in results:
        movie.append(m)
    return jsonify({"movies":movie})

@app.route("/category", methods = ['GET'])
def getCategory():
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT * FROM category"""
        )
        category = cursor.fetchall()
        cursor.execute(
            """SELECT DISTINCT(language) FROM movies join screen on movies.mid = screen.mid"""
        )
        language = cursor.fetchall()
        category_items = []
        for i in category:
            category_items.append(i)
        language_items = []
        for i in language:
            language_items.append(i)
        return jsonify({"category" : category_items,"language" : language_items})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@app.route("/gettheatre", methods = ["POST"])
def theatre():
    mid = request.json['mid']
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT theatre.tid, theatre.tname, theatre.phone FROM  theatre join movietheatre on movietheatre.tid = theatre.tid where movietheatre.mid = %s""",(mid,)
        )
        results = cursor.fetchall()
        available_theatre = []
        for t in results:
            available_theatre.append(t)
        return jsonify({"theatres":available_theatre})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@app.route("/getscreen", methods = ["POST"])
def screen():
    tid = request.json['tid']
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT * FROM screen WHERE tid = %s""",(tid)
        )
        results = cursor.fetchall()
        available_screen = []
        for t in results:
            available_screen.append(t)
        return jsonify({"screen":available_screen})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@app.route("/getseats", methods = ['POST'])
def getSeatOfScreen():
    screenid = request.json['screenid']
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT * from seats where screenid = %s and booked = 0""",(screenid)
            )
        results = cursor.fetchall()
        available_seats = []
        for t in results:
            available_seats.append(t)
        if len(available_seats) is 0:
            return jsonify({"message":"seat full"})
        else:
            return jsonify({"message":"available","availableSeats": available_seats})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

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
             (mid,uid,screenid,seatid,)
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
    try:
        if cid == "all":
            cursor.execute(
                """SELECT movies.mid, movies.mname, movies.cid,movies.language,category.cname from movies join category on category.cid = movies.cid join screen on movies.mid = screen.mid"""
            )
        else:
            cursor.execute(
                """SELECT movies.mid, movies.mname,movies.language,category.cname from movies join category on category.cid = movies.cid join screen on movies.mid = screen.mid where movies.cid = %s""",(cid)
            )
        results = cursor.fetchall()
        items = []
        for i in results:
            items.append(i)
        return jsonify({"movies":items})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@app.route('/languagefilter',methods=['POST'])
def filterbylanguage():
    language = request.json['language']
    cursor = mysql.connection.cursor()
    try:
        if language == "all":
            cursor.execute(
                """SELECT movies.mid,movies.mname,movies.language,movies.cid FROM movies join screen on movies.mid = screen.mid"""
            )
            results = cursor.fetchall()
            movie = []
            for m in results:
                movie.append(m)
            return jsonify({"movies":movie})
        else:
            cursor.execute(
                """SELECT movies.mid,movies.mname,movies.language,movies.cid FROM movies join screen on movies.mid = screen.mid WHERE language = %s""",(language,)
            )
            results = cursor.fetchall()
            items = []
            for i in results:
                items.append(i)
            print(items)
            return jsonify({"movies":items})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()


@app.route("/emptyseats", methods = ['POST'])
def enptyseat():
    screenid = request.json['screenid']
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
                """SELECT distinct(seat_no),seatid,screenid,mid FROM seats where booked = 0 and screenid = %s""",(screenid)
            )
        results = cursor.fetchall()
        items = []
        for i in results:
            items.append(i)
        return jsonify({"seats":items})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()


@app.route('/bookings', methods = ['POST'])
def myBookings():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'masai', algorithms=['HS256'])
    val = str(decode_data['uid'])
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT seats.seatid,seats.seat_no,movies.mname FROM seats join movies on seats.mid = movies.mid WHERE uid = %s AND seats.booked = 1""", (val,)
            )
        mysql.connection.commit()
        results = cursor.fetchall()
        items = []
        for i in results:
            items.append(i)
        return jsonify({"bookings":items})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@app.route('/cancel', methods = ['POST'])
def cancelTicket():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'masai', algorithms=['HS256'])
    val = str(decode_data['uid'])
    seatid = request.json['seatid']
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """UPDATE seats SET booked = 0 WHERE uid = %s AND seatid = %s""", (val,seatid,)
            )
        mysql.connection.commit()
        return {"message": "Ticket canceled"}
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()
    

