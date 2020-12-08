import os
import csv
import json
from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from register import register_commands, register_template_context


app = Flask(__name__)
bootstrap = Bootstrap(app)
basedir = os.path.abspath(os.path.dirname(__file__))

register_commands(app)
register_template_context(app)


@app.route('/')
def index():
    return render_template('school_location.html')


@app.route('/ajax/school_location')
def school_location():
    full_filename = os.path.join(basedir, 'uploads', 'area.csv')
    with open(full_filename, 'r', encoding='utf-8') as fp:
        reader = csv.DictReader(fp)
        data = []
        for datum in reader:
            data.append(datum)
    return json.dumps({'status': True, 'data': data})


if __name__ == '__main__':
    app.run()
