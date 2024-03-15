import streamlit as st
import numpy as np
import plotly.graph_objects as go
import scipy.stats as stats
# Define the bounds for the energy usage
min_usage_bound = 50  # kWh/month per capita for 100% score
max_usage_bound = 350  # kWh/month per capita for 0% score

# Function to calculate a linear sustainability score with capping at 0% and 100%
def calculate_sustainability_score(usage, min_bound, max_bound):
    if usage <= min_bound:
        return 100
    elif usage >= max_bound:
        return 0
    else:
        # Linear interpolation between min_bound and max_bound
        return 100 - ((usage - min_bound) / (max_bound - min_bound) * 100)

# Request user input
st.title('⚡ Sustainable Energy Consumption Analyzer')
def plot_bell_curve(usage, min_bound, max_bound):
    # Generate x values for the bell curve
    x = np.linspace(min_bound, max_bound, 400)
    # Use a standard normal distribution centered at the midpoint between the bounds
    mean = (max_bound + min_bound) / 2
    # Assuming that 99.7% of data falls within 3 standard deviations (empirical rule)
    std_dev = (max_bound - min_bound) / 6
    y = stats.norm.pdf(x, mean, std_dev)

    # Plotting the distribution and the user's point
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=x, y=y, mode='lines', name='Ideal Range'))
    fig.add_trace(go.Scatter(x=[usage], y=[stats.norm.pdf(usage, mean, std_dev)],
                             mode='markers', name='Your Usage', marker=dict(color='red', size=12)))

    # Add line for average usage boundaries
    fig.add_shape(type="line", x0=min_bound, y0=0, x1=min_bound, y1=np.max(y),
                  line=dict(color="Green", width=2, dash="dashdot"))
    fig.add_shape(type="line", x0=max_bound, y0=0, x1=max_bound, y1=np.max(y),
                  line=dict(color="Red", width=2, dash="dashdot"))
    
    fig.update_layout(title="Per Capita Monthly Energy Usage Distribution",
                      xaxis_title="Energy Usage (kWh/month per capita)",
                      yaxis_title="Density",
                      xaxis_range=[0,max_bound+50])
    return fig


monthly_consumption = st.number_input('Enter your total monthly household energy consumption (e.g., kWh)', min_value=0, value=500)
household_size = st.number_input('Enter the number of people in your household', min_value=1, value=2)

# Calculate per capita consumption
per_capita_consumption = monthly_consumption / household_size
bell_curve_fig = plot_bell_curve(per_capita_consumption, min_usage_bound, max_usage_bound)
st.plotly_chart(bell_curve_fig, use_container_width=True)
# Calculate sustainability score
sustainability_score = calculate_sustainability_score(per_capita_consumption, min_usage_bound, max_usage_bound)

# Display the sustainability score
st.header('Your Sustainability Score 🍃 ')
st.write(f"Your sustainability score: {sustainability_score:.2f}%")

# Plotting the user's sustainability score on a simple bar
fig = go.Figure()
fig.add_trace(
    go.Indicator(
        mode="gauge+number",
        value=sustainability_score,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': "Sustainability Score"},
        gauge={
            'axis': {'range': [0, 100]},
            'bar': {'color': "green" if sustainability_score > 50 else "red"},
            'steps': [
                {'range': [0, sustainability_score], 'color': "lightgray"},
                {'range': [sustainability_score, 100], 'color': "white"},
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': sustainability_score
            }
        }
    )
)

st.plotly_chart(fig, use_container_width=True)

# Provide personalized recommendations based on the sustainability score
st.header('Personalized Recommendations')
if sustainability_score <= 50:
    # Recommend ways to reduce consumption
    st.markdown('- Use energy-efficient appliances and lighting.')
    st.markdown('- Insulate your home to reduce heating and cooling costs.')
    st.markdown('- Implement smarter energy usage behaviors, such as turning off lights when not needed.')
else:
    # Commend sustainable energy usage and suggest further improvements
    st.markdown('- Maintain your energy-efficient habits.')
    st.markdown('- Consider investing in renewable energy sources like solar panels.')
    st.markdown('- Advocate for energy conservation in your community.')

# Run your app with `streamlit run your_script.py`