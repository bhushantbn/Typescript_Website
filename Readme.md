# GitHub User Search

This is a simple web application that allows users to search for GitHub profiles using the GitHub API. It displays user details in a modal popup and also shows a grid of popular GitHub users by default.

## Features

- 🔍 **Search GitHub Users**: Enter a username to find details.
- 📜 **Display in Modal Popup**: User details are displayed in a modal.
- 🎭 **Show Default Users**: Displays a list of predefined popular GitHub users.
- 🚀 **Styled UI**: Uses CSS animations and a responsive grid layout.
- ⚡ **Toast Notifications**: Displays messages for errors and input validation.

## Technologies Used

- **HTML**
- **CSS**
- **TypeScript**
- **GitHub API**

## Installation

#### 1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/github-user-search.git
   ```
#### 2. Navigate to the project directory:
    
    cd github-user-search
    

#### 3. Navigate to the project directory:
  
    npm install

#### 4. Compile TypeScript:
  
    npm run build
  
#### 5. Open ```index.html``` in your browser.

### Usage
1. Enter a GitHub username in the search bar.
2. Click the Search button or press Enter.
3. The user's details will be displayed in a modal popup.
4. Close the modal by clicking the X button or outside the modal.
5. If the user is not found, a toast notification will appear.

### Folder Structure

| Path                  | Description              |
|-----------------------|--------------------------|
| `/css/style.css`      | Styles for the UI        |
| `/dist/index.js`      | Compiled TypeScript      |
| `/src/index.ts`       | Main TypeScript file     |
| `index.html`          | Main HTML file           |
| `README.md`           | Project Documentation    |
| `package.json`        | Dependencies and scripts |
| `tsconfig.json`       | TypeScript configuration |