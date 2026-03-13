
      // ===== Replace with your API key =====
      const API_KEY = " your api "

      // ===== Load chat from localStorage =====
      let messages = JSON.parse(localStorage.getItem("chat")) || [];

      const chatDiv = document.getElementById("chat");

      // ===== Render messages =====
      function render() {
        chatDiv.innerHTML = "";

        messages.forEach((m) => {
          const p = document.createElement("p");
          p.textContent = m;
          chatDiv.appendChild(p);
        });
      }

      // ===== Save only last 10 messages =====
      function save() {
        localStorage.setItem("chat", JSON.stringify(messages.slice(-10)));
      }

      // ===== Send message to Gemini =====
      async function send() {
        const input = document.getElementById("msg");
        const userText = input.value;

        if (!userText) return;

        messages.push("User: " + userText);
        render();

        input.value = "";

        const prompt = "You are my father whose name is Bhagwati Prasad Khandelwa. You are a teacher by prof4ssion and is very strict with rules. now i am going to sdk something to you and you have to answer me by mimicing the charecter defined. make sure not to send any intro text. the message i sent you is: "

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: prompt + " " + userText }],


                  },
                ],
              }),
            },
          );

          if (!response.ok) {
            const errText = await response.text();
            console.error("Gemini API error:", errText);
            messages.push("Gemini: API error");
            render();
            return;
          }

          const data = await response.json();

          let aiText = "Error getting response";

          if (data.candidates && data.candidates.length > 0) {
            aiText = data.candidates[0].content.parts[0].text;
          }

          messages.push("Gemini: " + aiText);

          save();
          render();
        } catch (err) {
          messages.push("Gemini: API error");
          render();
        }
      }

      // ===== Load previous chat =====

      render();
