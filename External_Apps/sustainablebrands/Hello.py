import os
import streamlit as st
import google.generativeai as gen_ai
import plotly.graph_objects as go
import re


# Configure Streamlit page settings
st.set_page_config(
    page_title="Chat with Gemini-Pro!",
    page_icon=":brain:",  # Favicon emoji
    layout="centered",  # Page layout option
)

GOOGLE_API_KEY = st.secrets["GOOGLE_API_KEY"]


# Set up Google Gemini-Pro AI model
gen_ai.configure(api_key=GOOGLE_API_KEY)
model = gen_ai.GenerativeModel('gemini-pro')


# Function to translate roles between Gemini-Pro and Streamlit terminology
def translate_role_for_streamlit(user_role):
    if user_role == "model":
        return "assistant"
    else:
        return user_role


# Initialize chat session in Streamlit if not already present
if "chat_session" not in st.session_state:
    st.session_state.chat_session = model.start_chat(history=[])


# Display the chatbot's title on the page
st.title("Is Your Favorite Brand Sustainble-friendly ?")

# Display the chat history
for message in st.session_state.chat_session.history:
    with st.chat_message(translate_role_for_streamlit(message.role)):
        st.markdown(message.parts[0].text)
initial_prompt = """ gather and process information from various sources, including corporate sustainability reports, news articles, and online reviews.
   - The analysis highlights the brand's efforts in areas such as energy efficiency, waste reduction, and ethical sourcing, enabling users to support environmentally responsible companies.
GENERATE BRAND ANALYSIS OF THIS : 
"""
# Input field for user's message
user_prompt =  st.chat_input("Ask SustainX Bot...") 
see_prompt = user_prompt
if user_prompt:
    user_prompt += "" + initial_prompt 
    # Add user's message to chat and display it
    st.chat_message("user").markdown(see_prompt)

    # Send user's message to Gemini-Pro and get the response
    gemini_response = st.session_state.chat_session.send_message(user_prompt)
    score ="give the json_format and don't input anything else than json; sustain score in this format {score:x%}"
    gemini_response_score = st.session_state.chat_session.send_message(score)
    score = gemini_response_score.text
    #st.warning(gemini_response_score)
    match = re.search(r'(\d+)%', score)
    if match:
        # Convert the captured numerical string to float and strip the '%' sign
        score_value = float(match.group(1))

        # Create Gauge meter
        fig = go.Figure(
            go.Indicator(
                mode="gauge+number",
                value=score_value,
                title={'text': "Sustainable Score"},
                gauge={
                    'axis': {'range': [0, 100], 'tickcolor': "darkblue"},
                    'bar': {'color': "green" if score_value > 50 else "red"},
                    'bgcolor': "white",
                    'borderwidth': 2,
                    'bordercolor': "gray",
                    'steps': [
                        {'range': [0, 50], 'color': 'lightcoral'},
                        {'range': [50, 100], 'color': 'lightgreen'}
                    ],
                    'threshold': {
                        'line': {'color': "red", 'width': 4},
                        'thickness': 0.75,
                        'value': score_value
                    }
                }
            )
        )

        # Show plot in Streamlit
        st.plotly_chart(fig, use_container_width=True)
    # Display Gemini-Pro's response
    with st.chat_message("assistant"):
        st.markdown(gemini_response.text)