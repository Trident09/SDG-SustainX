import streamlit as st
import requests
from bs4 import BeautifulSoup
import pathlib
import textwrap
from inference import run_inference

import json



# Define function to scrape Amazon product page
def scrape_amazon(url):
    # Send HTTP request to the URL
    response = requests.get(url)
    # Use BeautifulSoup to parse and extract the required information
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.find_all("span", class_="a-list-item")

# Define the Streamlit app

def scrape_amazon_image(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all 'span' tags with class_="a-list-item".
    span_list_items = soup.find_all("span", class_="a-list-item")
    
    # For each 'span' tag, find the 'img' tag.
    for span in span_list_items:
        img = span.find('img')
        st.warning(img)
        if img:
            alt_text = img.get('alt')
            if alt_text:
                return img.get('src')
    
    return None

def main():

    st.title("Product Score Analyzer")

    # Input field for the Amazon URL
    amazon_url = st.text_input("Enter the Amazon product URL:")

    # Button to trigger scraping
    if st.button("Analyze ESG Score"):
        if amazon_url and amazon_url!='':
            # Extract text parts from Amazon URL
            list_items = scrape_amazon(amazon_url)
            get_image = scrape_amazon_image(amazon_url)
            texts = [item.get_text(strip=True) for item in list_items]
            concatenated_text = " ".join(texts)
            #st.warning(concatenated_text)
            # Send a request to your API here ...
            # Configure the API key
            
            # Generate body for API request
            prompt = """
                only reponse in json format like {esg_score : 'value(0-100)' } sample:
                 {
    "esg_score": "60",
    "pros": {
        "1": "BPA-Free heavy-duty clear plastic",
        "2": "Sturdy and durable",
        "3": "Recyclable",
        "4": "Elegant design suitable for any occasion",
        "5": "Conveniently packaged to prevent damage during shipping",
        "6": "Excellent value for money"
    },
    "cons": {
        "1": "Not microwave or oven safe",
        "2": "May not be as durable as traditional silverware",
        "3": "Bulk purchase may not be suitable for small gatherings",
        "4": "Plastic waste if not properly recycled"
    }
}
 that is the sustainbility score of this content :
analysis this : 
""" + concatenated_text
          
            # Make the API request
            response = run_inference(prompt)
            st.balloons()
            #st.warning(response)
            response_dict = json.loads(response)
            # Assuming response is in format {"esg_score": 20}
            #insert image
            #st.image(get_image, caption='Product Image', width=200) # Resizes the image to 200 pixels wide            # # Display the ESG score and circular wheel graph
            #st.json(response_dict)
            st.header('ESG Score: ')
            st.write(response_dict['esg_score'])

            st.header('Pros: ')
            for key, value in response_dict['pros'].items():
                st.write(f'{key}. {value}')

            st.header('Cons: ')
            for key, value in response_dict['cons'].items():
                st.write(f'{key}. {value}')
        else:
            st.error("Please enter a valid Amazon product URL.")

# Run the Streamlit app
if __name__ == "__main__":
    main()