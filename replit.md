# Agentic Data Connection Layer (DCL)

## Overview
The Agentic Data Connection Layer (DCL) is an intelligent system designed to autonomously discover and map data sources from various enterprise systems to a predefined ontology using AI. It validates these mappings through quality checks and automatically publishes them as DuckDB views. The system features a real-time web dashboard with interactive data flow graphs and AI-powered schema inference. The project aims to provide a dynamic data connection layer, aligning diverse data sources to unified ontologies for consumption by specialized AI agents, thereby streamlining data integration and analytical processes within an enterprise.

## User Preferences
- **AI Provider**: Gemini API (GEMINI_API_KEY environment variable)
- **Model**: `gemini-2.5-pro` (not `gemini-pro` which is retired)
- **Design Constraint**: Preserve existing GUI, add new features as separate sections

## System Architecture

### Production Mode (Prod Mode Toggle)
The DCL features a Prod Mode toggle that controls how data mappings are validated:
- **Prod Mode ON (Production-Ready):** Uses LLM + RAG for intelligent semantic validation via Gemini AI, providing historical mapping context and rejecting semantically incorrect mappings.
- **Prod Mode OFF (Heuristic-Based):** Uses hard-wired rules for fast, deterministic filtering based on domain categories (e.g., FinOps sources map to FinOps entities). This mode is suitable for testing and development.

### UI/UX Decisions
The user interface features a modern design with:
- **Collapsible Panels**: Left Navigation, Left Data Sources, and Right Status/Narration panels are independently collapsible, allowing the center graph to expand.
- **Sankey Default View**: The default visualization is a Sankey diagram for data flow, with a toggle to switch to a Graph view.
- **Smart Graph Expansion**: The central graph dynamically adjusts its width.
- **Progress Indicator**: A staged processing progress bar is always visible at the top right.
- **Layout Reorganization**: Narration is in the right sidebar, and Source/Unified Previews are in a "Notes" section below the graph.
- **5-Second Hook Modal**: A welcome modal appears on page load.
- **Mobile Responsiveness**: Fully responsive design with auto-collapsing panels, reduced padding, and optimized touch interactions.
- **Real-Time Agent Visualization**: The "Connect & Map" button provides instant feedback, displaying agent activity and thought processes with typewriter animation in the Narration panel.

### Technical Implementations
- **Multi-Agent Architecture**: The DCL dynamically adapts its ontology and data flows based on user-selected domain agents (e.g., RevOps Pilot, FinOps Pilot) and data sources.
- **Smart Edge Filtering**: Sankey diagrams only display edges for data that actively flows to selected agents.
- **Dynamic Node Creation**: Ontology nodes only appear if they receive actual data from sources.
- **RAG Engine**: Implemented for context-aware, learning-based schema mapping with historical memory using Pinecone for embeddings and storage.
- **Schema Inference**: AI-powered schema inference allows custom fields and AI-powered ontology mappings.
- **DuckDB Views**: Mapped data is automatically published as DuckDB views.
- **FinOps Alignment**: The FinOps ontology is fully aligned with the standalone FinOps Autopilot agent schema, including specific entities like `aws_resources` and `cost_reports`.

### System Design Choices
- **Backend Services**: A FastAPI server handles ontology mapping, DuckDB view management, and RAG engine integration.
- **Data Flow Logic**: A heuristic planner filters mappings based on selected agents.
- **Autoscale Deployment Optimization**: Optimized for Autoscale deployment with efficient dependency installation and streamlined build commands.
- **Environment Variables**: `GEMINI_API_KEY`, `PINECONE_API_KEY`, and `GITHUB_TOKEN` are used for configuration.

### Authentication & Security
Authentication is currently disabled for ease of use (`AUTH_ENABLED = False` in `app.py`). When re-enabled, it uses Supabase Auth for email/password, role-based access control (admin/viewer roles), and secures routes with Row Level Security (RLS) and JWT tokens.

## External Dependencies
- **AI Provider**: Google Gemini API (`gemini-2.5-pro`).
- **Vector Database**: Pinecone Inference API (for embeddings using `multilingual-e5-large`) and Pinecone Serverless (for vector storage, index "schema-mappings-e5" in `us-east-1`).
- **Database**: DuckDB for creating and managing data views.
- **Authentication**: Supabase for user authentication and role management (when enabled).
- **Visualization Libraries**: Cytoscape.js for graph visualization.
- **Data Sources**: Integration with enterprise systems like Dynamics, Salesforce, SAP, NetSuite, Snowflake, Supabase, MongoDB, and Legacy SQL databases.

## Recent Changes (October 18, 2025)
- **Brand Logo**: Replaced "AOS Platform" text with autonomOS logo and wordmark across all pages in the left navigation
- **Comprehensive Hover Tooltips**: Added informative hover explanations across entire AOA Control Center interface
  - Global controls (AOA Header, Autonomy Mode, UI Mode toggles)
  - All 10 AOA Function Cards with detailed descriptions
  - Dashboard components (Active Agent Performance)
  - DCL components (DCL Header, Graph, Intelligence Review, RAG Engine, Narration)
  - xAO Page (sidebar link, header, and all 6 metrics with detailed tooltips)