# Srin.ai - AI Financial Advisor

Srin.ai is an innovative application that leverages artificial intelligence to provide personalized financial advice. Upload your financial documents, and our AI will analyze your spending habits, investments, and financial goals to offer actionable insights and help you achieve financial well-being.

## ✨ Features

-   **Secure File Uploads**: Safely upload your financial statements and documents.
-   **AI-Powered Analysis**: Get a comprehensive analysis of your financial health powered by advanced AI models.
-   **Personalized Recommendations**: Receive tailored advice on budgeting, saving, and investing.
-   **Interactive Dashboard**: Visualize your financial data through an intuitive and user-friendly dashboard.
-   **Goal Tracking**: Set and monitor your financial goals to stay on track.

## 🛠️ Tech Stack

### Frontend

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### Backend

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)

### Database & Auth

-   **Database**: [Supabase](https://supabase.io/) (PostgreSQL)
-   **Authentication**: [Supabase Auth](https://supabase.io/docs/guides/auth)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js and npm
    ```sh
    npm install npm@latest -g
    ```
-   A Supabase account.

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/Srinjoy12/Srin.ai-AI-Financial-Advisor.git
    ```
2.  **Install Frontend Dependencies**
    ```sh
    cd frontend
    npm install
    ```
3.  **Install Backend Dependencies**
    ```sh
    cd ../backend
    npm install
    ```
4.  **Set up Environment Variables**
    -   Create a `.env.local` file in the `frontend` directory.
    -   Add your Supabase Project URL and Anon Key:
        ```env
        NEXT_PUBLIC_SUPABASE_URL='YOUR_SUPABASE_URL'
        NEXT_PUBLIC_SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY'
        ```

### Running the Application

1.  **Start the backend server**
    ```sh
    cd backend
    npm start
    ```
2.  **Start the frontend development server**
    ```sh
    cd frontend
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information. 