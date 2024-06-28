import os
import json
from flask import Flask, render_template, redirect, request, session, jsonify, flash, url_for
import mysql.connector
import hashlib

# DB(MySQL)に接続するFlaskの設定

app = Flask(__name__)
app.secret_key = "py24"
app.json.ensure_ascii = False


def database_connection():
    # どこに接続をするか

    return mysql.connector.connect(
        user="root", password="root", host="localhost", port="3306", database="py"
    )

# indexページ


@app.route("/")
def index():
    if session.get("login", False):
        return redirect("/dashboard")
    else:
        return render_template("index.html")
        # return render_template("index.html", login=session.get("login", False))

# ダッシュボード


@app.route("/dashboard")
def dashboard():
    # ログインしている場合はダッシュボードを表示する
    if session.get("login", False):
        return render_template("dashboard.html")

    # ログインしていない場合はログイン画面に飛ばす
    return redirect("/login")

# ログイン画面


@app.route("/login")
def login():
    if session.get("login", False):
        return redirect("/")

    return render_template("login.html")

# 認証処理


@app.route("/auth", methods=["POST"])
def auth():
    email = request.form.get("email")
    password = request.form.get("password")

    if email is None or password is None:
        return redirect("/login")

    password = hashlib.sha256(password.encode()).hexdigest()
    print(password)

    try:
        cnx = mysql.connector.connect(
            user="root", password="root", host="localhost", port="3306", database="py"
        )
        # 接続できているか確認
        if cnx.is_connected:
            cur = cnx.cursor()
            cur.execute(
                "SELECT * FROM users WHERE email = %s and password = %s",
                (
                    email,
                    password,
                ),
            )

            # 一件取得
            user = cur.fetchone()
            session["login"] = True
            session["user"] = user

            cnx.close()
    except Exception as e:
        print(e)
        return redirect("/login")

    return redirect("/dashboard")

# ログアウトページ


@app.route("/signout")
def signout():
    session["login"] = False
    session["user"] = None
    return redirect("/")

# 登録ページ


@app.route("/signup", methods=["GET"])
def signup():
    # ログインしている場合はdashboard画面に飛ばす
    if session.get("login", False):
        return render_template("dashboard.html")

    return render_template("signup.html")


@app.route("/signup", methods=["POST"])
def signup_backend():
    # ログインしている場合はdashboard画面に飛ばす
    if session.get("login", False):
        return render_template("dashboard.html")

    email = request.form.get("email")
    password = request.form.get("password")
    username = request.form.get("username")
    sql = "INSERT INTO users (email, password, username) VALUES (%s, %s, %s)"

    if email is None or password is None or username is None:
        return redirect("/signup")

    password = hashlib.sha256(password.encode()).hexdigest()
    print(password)

    try:
        cnx = database_connection()
        cur = cnx.cursor()
        cur.execute(
            sql,
            (
                email,
                password,
                username,
            ),
        )
        cnx.commit()
        cnx.close()
    except Exception as e:
        print(e)
        return redirect("/signup")

    return redirect("/login")

# 削除ページ


@app.route("/delete_user", methods=["GET"])
def delete_user():
    return render_template("delete_user.html")


@app.route("/delete_user", methods=["POST"])
def delete_user_backend():
    username = request.form.get("username")
    email = request.form.get("email")
    password = request.form.get("password")
    sql = "DELETE FROM users WHERE username = %s and email = %s and password = %s"

    if username is None or email is None or password is None:
        return redirect("/dashboard")

    password = hashlib.sha256(password.encode()).hexdigest()

    try:
        cnx = database_connection()
        cur = cnx.cursor()
        cur.execute(
            sql,
            (
                username,
                email,
                password,
            ),
        )
        if cur.rowcount == 0:
            # No such user found
            return "入力したユーザー名：" + request.form.get("username") + "\n入力したメール：" + request.form.get("email") + "\n入力したパスワード：" + request.form.get("password") + "\n指定しているユーザーが存在しません。", 404

        cnx.commit()
        cnx.close()

        # flash("ユーザーを削除しました.", "success")
        session["login"] = False
        session["user"] = None

    except Exception as e:
        print(e)
        return redirect("/delete_user")

    flash("ユーザーが削除されました。", "success")
    return redirect("/")


@app.route("/get_json")
def get_json():
    # jsonファイルの存在を確認
    if not os.path.exists("./static/recipe.json"):
        return "File not found", 404
    with open("./static/recipe.json", "r", encoding="utf-8") as f:
        json_data = json.load(f)
    return jsonify(json_data)


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=8080)
