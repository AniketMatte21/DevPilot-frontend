# DevPilot — AI-Powered GitHub Codebase Assistant

DevPilot is a Spring Boot-based backend that integrates with GitHub repositories to retrieve and process source code, build RAG (Retrieval-Augmented Generation) document chunks, and enable AI-powered conversations grounded in repository context.

The system retrieves repository metadata, recursive file trees, and source-file contents through the GitHub API. It processes the code into structured RAG chunks enriched with metadata such as repository ID, file path, programming language, and chunk index. This indexed context is then used to generate AI responses tailored to the developer's codebase.

## Key Features

- GitHub Integration — Retrieves repositories, repository trees, branches, and source-file contents through the GitHub API.
- Repository Code Processing — Fetches and decodes file contents, including Base64-encoded GitHub responses.
- RAG-Based Code Indexing — Converts repository source code into structured document chunks for contextual AI retrieval.
- Indexing Progress Tracking — Tracks total files, processed files, indexing status, and generated chunks.
- Context-Aware AI Chat — Generates prompts that constrain AI responses to the retrieved codebase context.
- Chat Session Management — Supports creation and management of repository-focused AI chat sessions.

## Technology Stack

Java • Spring Boot • GitHub REST API • RAG • AI/LLM Integration • REST APIs

## Project Workflow

```text
GitHub Repository
       ↓
GitHub API
       ↓
Repository & File Retrieval
       ↓
Code Processing & Chunking
       ↓
RAG Document Indexing
       ↓
Context Retrieval
       ↓
AI Prompt Generation
       ↓
Codebase-Aware AI Chat
