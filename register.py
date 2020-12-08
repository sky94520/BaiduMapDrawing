import os
import pandas
from flask import current_app, url_for

from utils import get_position
from config import BAIDU_AK


def register_commands(app):
    @app.cli.command()
    def school_location():
        """get lng and lat of schools"""
        data = []
        schools = [
            {'name': '东南大学', 'city': '南京市'},
            {'name': '南京大学', 'city': '南京市'},
            {'name': '南京工程学院', 'city': '南京市'}
        ]
        for idx, school in enumerate(schools):
            geo_result = get_position('%s(%s)' % (school['name'], school['city']))
            datum = {'name': school['name']}
            datum.update(geo_result['result']['location'])
            data.append(datum)
        df = pandas.DataFrame(data)
        # 去除索引
        df.to_csv('uploads/area.csv', index=False)


def register_template_context(app):
    @app.context_processor
    def make_template_context():
        # 发送scrapyd的所有模板上下文
        return dict(BAIDU_AK=BAIDU_AK)

    @app.context_processor
    def inject_url():
        return {
            'url_for': dated_url_for
        }


def dated_url_for(endpoint, **kwargs):
    """重写jinja模板的url_for函数，静态函数时根据文件的修改时间戳来避免强制刷新缓存"""
    filename = None
    if endpoint == 'static':
        filename = kwargs.get('filename', None)
    if filename:
        input_path = os.path.join(current_app.root_path, endpoint, filename)
        if os.path.exists(input_path):
            kwargs['v'] = int(os.stat(input_path).st_mtime)
    return url_for(endpoint, **kwargs)
