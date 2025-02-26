# Formulize | Adyen Integration Sandbox

A powerful low-code sandbox environment for rapidly prototyping Adyen payment integrations. This tool provides an interactive development environment with real-time parsing and validation of JavaScript, CSS, and JSON configurations.

> 💡 Check out it out live at [checkoutlab.dev](https://checkoutlab.dev)

## Features

### Low-Code Development Environment
- Real-time JavaScript parsing and validation using Babel
- Live CSS editing with instant preview
- JSON schema validation for API requests
- Interactive configuration builder for Adyen components
- TypeScript support throughout the application

### Technical Capabilities
- **Code Parsing**: Uses Babel AST for JavaScript analysis and transformation
- **Type Generation**: Automatic TypeScript type generation from Adyen's SDK
- **Real-time Validation**: Immediate feedback on configuration errors
- **API Integration**: Built-in support for Adyen's API endpoints
- **State Management**: Redux-based state management for consistent data flow

### Developer Experience
- Split-pane editing environment
- Real-time preview of changes
- Built-in code formatting
- Keyboard shortcuts for common actions
- Shareable configurations via URL

## Getting Started

1. Clone the repository:

    ```sh
    git clone https://github.com/objStevo/payment-sandbox.git
    cd formulize
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Configure environment:
- Copy `.env.example` to `.env`
- Add your Adyen API credentials

4. Start development server:

    ```sh
    npm run dev
    ```

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **State Management**: Redux Toolkit
- **Code Parsing**: Babel, TypeScript Compiler API
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **API Integration**: REST APIs with built-in validation

## Architecture

The application is built around several core components:

- **Code Editor**: Custom implementation using CodeMirror
- **Type Parser**: Utilizes TypeScript's Compiler API
- **Configuration Builder**: Dynamic form generation from Adyen schemas
- **Preview Environment**: Live rendering of Adyen components
- **API Client**: Typed API client for Adyen endpoints

## Roadmap

### In Progress
1. Enhanced JavaScript linting and error messaging
2. Expanded configuration templates
3. Advanced sharing capabilities
4. Component variant configurations
5. Integration with Adyen's Test Cards API

### Planned Features
1. WebSocket support for real-time collaboration
2. Additional payment method configurations
3. Enhanced error handling and debugging tools
4. Integration with Adyen's Testing API
5. Custom component theming

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
