# inference.py
import requests
import json

def run_inference(prompt):
    url = 'https://lastmileai.dev/api/inference/run'
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://lastmileai.dev/workbooks/cltrd8qa80003qydd5g8pcwpz',
        'Content-Type': 'application/json',
        'Origin': 'https://lastmileai.dev',
        'DNT': '1',
        'Sec-GPC': '1',
        'Connection': 'keep-alive',
        'Cookie': '_ga_V1ZLB0QB6Z=GS1.1.1708801276.9.0.1708801276.0.0.0; _ga=GA1.1.599186708.1707661971; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..g7jBV3MbB7npM8r5.6K0TlcgohUKT6PRnyKpW1DOVCYV7F84Nh6wTbD9vDbEse8ZzUCE4-IoMnj2nAfv_1vBP0MXhEhKEu0ui8fKp-_iPC0TMm8CQ-l4kz96xWAxS22ySXvPo0A_KZMeaUZN-M9tuTVrdxEEW-_LXwmEy8L1CQhVkIamKDkkMOUANcENQmkJ1lUwh9Pix0E6IgGWqcCYfd0UOBcm8cTppEUnXdWsuPeqHg11jZkqg5uNZdpvRiI2xIbpBDhjxBcxElM-HJTYKoihBKQGUNn9QDPe4pQ.dDKDMu7yWQZzsswi_Yxdqg; __Host-next-auth.csrf-token=992c81e87b6c8869eef129352e28cbb46388476cb2b892a072b34fb84ac6e180%7Cf830c6a75e87833a8aa6d5b830c2014e3fa4bab97a6830690c037d74ff6ff731; __Secure-next-auth.callback-url=https%3A%2F%2Flastmileai.dev%2Fworkbooks%2Fclts9k6hp008xqpl3gvddq8hm; _dd_s=rum=2&id=bca7007a-2a3b-4245-b8b6-8dcfd7ced67a&created=1710516149539&expire=1710517521679',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'TE': 'trailers'
    }
    data = {
        "prompt": "hello",
        "model": "ChatGPT",
        "modelId": "clk04bzgv0008pkocbf9odt4r",
        "trialId": "cltstfl7f0061qyneuvcup0fj",
        "trialStepId": "cltstfl7m0064qynek9jmfjap",
      
        "parameters": {},
        "cellName": "cell_1",
        "completionParams": {
           "model": "gpt-3.5-turbo",
                "remember_chat_context": True,
                "max_tokens": 1096,
                "temperature": 0.50,
                "top_p": 1,
                "messages": [
                    {
                        "content": prompt+'also add pros and cons in json in markdown format with points ',
                        "role": "user"
                    }
                ]
        }
    }
    response = requests.post(url, headers=headers, json=data)
    response_json = response.json()
    return response_json['data']['choices'][0]['message']['content']
