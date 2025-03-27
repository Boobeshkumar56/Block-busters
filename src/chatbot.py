import google.generativeai as genai

API_KEY = ""
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-pro")

print("Welcome to the Menstrual Health Chatbot! Type 'exit' to stop.")

while True:
    user_input = input("\nYou: ")
    
    if user_input.lower() == "exit":
        print("Goodbye! Stay healthy.")
        break

    response = model.generate_content(user_input)
    

    print("\nChatbot:", response.text)
