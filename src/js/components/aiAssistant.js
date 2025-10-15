import { gsap } from 'gsap';

// AI Assistant variables
let assistantWindow;
let assistantIcon;
let messagesContainer;
let inputField;
let sendButton;
let isOpen = false;

// Department information for the AI
const departmentInfo = {
  name: 'Cosmic CS Universe',
  courses: [
    'Introduction to Computer Science',
    'Data Structures & Algorithms',
    'Artificial Intelligence',
    'Computer Graphics',
    'Machine Learning',
    'Quantum Computing'
  ],
  faculty: [
    'Dr. Ada Lovelace - Department Chair, Quantum Computing',
    'Dr. Alan Turing - Professor, Artificial Intelligence',
    'Dr. Grace Hopper - Associate Professor, Compiler Design',
    'Dr. John von Neumann - Professor, Computer Architecture',
    'Dr. Margaret Hamilton - Associate Professor, Software Engineering',
    'Dr. Tim Berners-Lee - Assistant Professor, Web Technologies'
  ],
  contact: {
    email: 'cs@cosmic-university.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Way, Innovation District, Cosmic City'
  },
  faq: [
    {
      question: 'What are the admission requirements?',
      answer: 'Admission requirements include a strong background in mathematics, programming experience, and a minimum GPA of 3.5. For graduate programs, GRE scores are also required.'
    },
    {
      question: 'Are there scholarships available?',
      answer: 'Yes, the department offers merit-based scholarships, research assistantships, and teaching assistantships for qualified students.'
    },
    {
      question: 'What research areas does the department focus on?',
      answer: 'Our department focuses on Artificial Intelligence, Machine Learning, Quantum Computing, Data Science, Robotics, and Computer Graphics.'
    }
  ]
};

// Initialize AI Assistant
export async function initAIAssistant() {
  // Get DOM elements
  assistantWindow = document.querySelector('.ai-assistant-window');
  assistantIcon = document.querySelector('.ai-assistant-icon');
  messagesContainer = document.querySelector('.ai-assistant-messages');
  inputField = document.querySelector('.ai-assistant-input input');
  sendButton = document.querySelector('.ai-assistant-input .send-btn');
  
  // Add "Coming Soon" badge to the AI assistant icon
  addComingSoonBadge();
  
  // Update input placeholder and header
  if (inputField) {
    inputField.placeholder = "AI Assistant coming soon - try typing a message!";
  }
  
  // Update header title
  const headerTitle = document.querySelector('.ai-assistant-header h3');
  if (headerTitle) {
    headerTitle.innerHTML = 'Department AI Assistant <span style="color: #ffa500; font-size: 0.8em;">(Coming Soon)</span>';
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Add welcome message
  addMessage('assistant', '🚀 AI Assistant Coming Soon! We\'re working on bringing you an intelligent assistant to help with department information. Stay tuned!');
}

// Add "Coming Soon" badge to AI assistant icon
function addComingSoonBadge() {
  const badge = document.createElement('div');
  badge.className = 'coming-soon-badge';
  badge.innerHTML = 'Coming Soon';
  
  // Add styles for the badge
  const style = document.createElement('style');
  style.textContent = `
    .coming-soon-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: linear-gradient(45deg, #ff6b6b, #ffa500);
      color: white;
      font-size: 10px;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
      animation: pulse 2s infinite;
      z-index: 1000;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 4px 16px rgba(255, 107, 107, 0.5);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Add badge to the AI assistant icon
  if (assistantIcon) {
    assistantIcon.style.position = 'relative';
    assistantIcon.appendChild(badge);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Toggle assistant window
  assistantIcon.addEventListener('click', toggleAssistant);
  
  // Close button
  document.querySelector('.close-btn').addEventListener('click', closeAssistant);
  
  // Send message on button click
  sendButton.addEventListener('click', sendMessage);
  
  // Send message on Enter key
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// Toggle assistant window
function toggleAssistant() {
  if (isOpen) {
    closeAssistant();
  } else {
    openAssistant();
  }
}

// Open assistant window
function openAssistant() {
  assistantWindow.style.display = 'flex';
  
  gsap.fromTo(assistantWindow, 
    { opacity: 0, scale: 0.9, y: 20 },
    { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      duration: 0.5, 
      ease: 'back.out(1.7)'
    }
  );
  
  isOpen = true;
  
  // Focus input field
  setTimeout(() => {
    inputField.focus();
  }, 300);
}

// Close assistant window
function closeAssistant() {
  gsap.to(assistantWindow, {
    opacity: 0,
    scale: 0.9,
    y: 20,
    duration: 0.3,
    ease: 'power3.in',
    onComplete: () => {
      assistantWindow.style.display = 'none';
    }
  });
  
  isOpen = false;
}

// Send message
async function sendMessage() {
  const message = inputField.value.trim();
  
  if (!message) return;
  
  // Add user message to chat
  addMessage('user', message);
  
  // Clear input field
  inputField.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Simulate delay for coming soon message
  setTimeout(() => {
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add coming soon message
    addMessage('assistant', '🚀 Thank you for your message! Our AI Assistant is currently under development. We\'re working hard to bring you an intelligent assistant that can help with department information, course details, faculty inquiries, and more. Please check back soon!');
  }, 1500);
}

// Get AI response
async function getAIResponse(message) {
  // In production, this would call the OpenAI API
  // For now, we'll use a simple rule-based approach
  
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();
  
  // Check for course-related questions
  if (lowerMessage.includes('course') || lowerMessage.includes('class') || lowerMessage.includes('curriculum')) {
    return `Our department offers the following courses:\n\n${departmentInfo.courses.map(course => `• ${course}`).join('\n')}`;
  }
  
  // Check for faculty-related questions
  if (lowerMessage.includes('faculty') || lowerMessage.includes('professor') || lowerMessage.includes('teacher') || lowerMessage.includes('instructor')) {
    return `Our faculty members include:\n\n${departmentInfo.faculty.map(faculty => `• ${faculty}`).join('\n')}`;
  }
  
  // Check for contact-related questions
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('address')) {
    return `You can contact the department at:\n\nEmail: ${departmentInfo.contact.email}\nPhone: ${departmentInfo.contact.phone}\nAddress: ${departmentInfo.contact.address}`;
  }
  
  // Check for admission-related questions
  if (lowerMessage.includes('admission') || lowerMessage.includes('apply') || lowerMessage.includes('application')) {
    return departmentInfo.faq[0].answer;
  }
  
  // Check for scholarship-related questions
  if (lowerMessage.includes('scholarship') || lowerMessage.includes('financial aid') || lowerMessage.includes('funding')) {
    return departmentInfo.faq[1].answer;
  }
  
  // Check for research-related questions
  if (lowerMessage.includes('research') || lowerMessage.includes('focus') || lowerMessage.includes('specialization')) {
    return departmentInfo.faq[2].answer;
  }
  
  // Default response
  return `Thank you for your question. The ${departmentInfo.name} department is at the forefront of computer science education and research. How else can I assist you with information about our courses, faculty, or programs?`;
  
  // In production, you would use the OpenAI API like this:
  /*
  const completion = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an AI assistant for the Computer Science Department. Be helpful, concise, and knowledgeable." },
      { role: "user", content: message }
    ],
    max_tokens: 150
  });
  
  return completion.data.choices[0].message.content;
  */
}

// Add message to chat
function addMessage(role, content) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${role}-message`;
  
  // Format content (replace newlines with <br>)
  const formattedContent = content.replace(/\n/g, '<br>');
  
  messageElement.innerHTML = `
    <div class="message-content">
      ${formattedContent}
    </div>
  `;
  
  // Add to messages container
  messagesContainer.appendChild(messageElement);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Animate message in
  gsap.from(messageElement, {
    y: 20,
    opacity: 0,
    duration: 0.3,
    ease: 'power3.out'
  });
}

// Show typing indicator
function showTypingIndicator() {
  const typingElement = document.createElement('div');
  typingElement.className = 'message assistant-message typing-indicator';
  
  typingElement.innerHTML = `
    <div class="message-content">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `;
  
  // Add to messages container
  messagesContainer.appendChild(typingElement);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .typing-indicator .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.7);
      margin-right: 4px;
      animation: typing-dot 1.4s infinite ease-in-out;
    }
    
    .typing-indicator .dot:nth-child(1) {
      animation-delay: 0s;
    }
    
    .typing-indicator .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-indicator .dot:nth-child(3) {
      animation-delay: 0.4s;
      margin-right: 0;
    }
    
    @keyframes typing-dot {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-5px);
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Remove typing indicator
function removeTypingIndicator() {
  const typingIndicator = document.querySelector('.typing-indicator');
  
  if (typingIndicator) {
    typingIndicator.remove();
  }
}
