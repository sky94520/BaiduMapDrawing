import hashlib
import requests
from urllib import parse

from config import BAIDU_AK


def get_position(address):
    """
    请求百度，获取地址所在的经纬度
    :param address: 地址，比如东南大学 或昆山开发区前进东路企业科技园科技广场1505室
    :return:{'status': 0, 'result':
        {'location':
            {'lng': float, 'lat': float}, 'precise': 0, 'confidence': 70, 'comprehension': 0, 'level': '教育'}}
    """
    # 以get请求为例http://api.map.baidu.com/geocoder/v2/?address=百度大厦&output=json&ak=你的ak
    queryStr = '/geocoder/v2/?address=%s&output=json&ak=kNPyYMh5Yx4huR43nIRCYiO2Ms4XCNTD' % address
    # 对queryStr进行转码，safe内的保留字符不转换
    encodedStr = parse.quote(queryStr, safe="/:=&?#+!$,;'@()*[]")
    # 在最后直接追加上yoursk
    rawStr = encodedStr + BAIDU_AK
    # 计算sn
    sn = (hashlib.md5(parse.quote_plus(rawStr).encode("utf8")).hexdigest())
    # 由于URL里面含有中文，所以需要用parse.quote进行处理，然后返回最终可调用的url
    url = parse.quote("http://api.map.baidu.com" + queryStr + "&sn=" + sn, safe="/:=&?#+!$,;'@()*[]")
    result = eval(requests.get(url).text)
    return result
