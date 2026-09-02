import {
  ArrowDown,
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  FileCode2,
  FolderGit2,
  GitBranch,
  Layers3,
  MessageSquare,
  Search,
  Server,
  Sparkles,
  Upload,
  User,
  Workflow,
  Zap,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


// =====================================================
// GITHUB ICON
// =====================================================

function GithubIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.621.069-.609.069-.609 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.6 9.6 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}


// =====================================================
// PAGE
// =====================================================

function OverviewPage() {
  return (
    <div className="w-full space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="space-y-3">

<div className="w-full px-6 py-4 sm:px-8">
  <div className="flex items-center gap-3">
    
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
      <Workflow className="h-5 w-5" />
    </div>

    <div>
      <h2 className="text-xl font-bold tracking-tight sm:text-3xl">
        Application Overview
      </h2>

      <p className="text-sm text-muted-foreground">
        Understand how DevPilot connects your GitHub repository,
        RAG pipeline and AI chat.
      </p>
    </div>

  </div>
</div>

      </div>


      {/* =====================================================
          HIGH LEVEL FLOW
      ===================================================== */}

      <Card className="overflow-hidden">

        <CardContent className="p-5 sm:p-7">

          <div className="mb-6">

            <div className="flex items-center gap-2">

              <Sparkles className="h-5 w-5 text-primary" />

              <h2 className="text-lg font-semibold">
                How DevPilot Works
              </h2>

            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              The complete journey from GitHub repository to AI-powered
              code answers.
            </p>

          </div>


          {/* FLOW */}

          <div className="overflow-x-auto pb-3">

            <div className="flex min-w-[850px] items-center justify-between gap-3">

              <FlowNode
                icon={<GithubIcon />}
                title="GitHub"
                description="Connect repository"
              />

              <FlowArrow />

              <FlowNode
                icon={<FolderGit2 />}
                title="Repository"
                description="Select project"
              />

              <FlowArrow />

              <FlowNode
                icon={<Database />}
                title="RAG Index"
                description="Process & store code"
              />

              <FlowArrow />

              <FlowNode
                icon={<MessageSquare />}
                title="Chat"
                description="Ask questions"
              />

              <FlowArrow />

              <FlowNode
                icon={<Bot />}
                title="AI Answer"
                description="Context-aware response"
              />

            </div>

          </div>

        </CardContent>

      </Card>


      {/* =====================================================
          MAIN TREE
      ===================================================== */}

      <Card>

        <CardContent className="p-5 sm:p-7">

          <SectionHeader
            icon={<Workflow />}
            title="Application Workflow"
            description="Step-by-step flow of the complete application."
          />


          <div className="mt-8">

            {/* ROOT */}

            <TreeRoot
              icon={<User />}
              title="User"
              description="Developer using DevPilot"
              badge="Start"
            />


            <TreeLine />


            {/* AUTH */}

            <TreeBranch>

              <TreeNode
                icon={<GithubIcon />}
                title="GitHub Authentication"
                description="User signs in using GitHub OAuth2."
                badge="OAuth2"
              />

              <TreeLine />


              {/* DASHBOARD */}

              <TreeNode
                icon={<Layers3 />}
                title="Dashboard"
                description="User enters the main DevPilot workspace."
              />

              <TreeLine />


              {/* REPOSITORIES */}

              <TreeNode
                icon={<FolderGit2 />}
                title="Repository Management"
                description="Fetch, display and select GitHub repositories."
              />

              <TreeLine />


              {/* INDEXING */}

              <TreeNode
                icon={<Database />}
                title="Repository Indexing"
                description="Selected repository is processed through the RAG pipeline."
                badge="RAG"
                highlighted
              />

              <TreeLine />


              {/* CHAT */}

              <TreeNode
                icon={<MessageSquare />}
                title="Repository Chat"
                description="User asks questions about the indexed codebase."
              />

              <TreeLine />


              {/* RETRIEVAL */}

              <TreeNode
                icon={<Search />}
                title="Context Retrieval"
                description="Relevant code chunks are retrieved from the vector database."
              />

              <TreeLine />


              {/* AI */}

              <TreeNode
                icon={<BrainCircuit />}
                title="AI Processing"
                description="Retrieved context is provided to the AI model."
              />

              <TreeLine />


              {/* RESPONSE */}

              <TreeNode
                icon={<Bot />}
                title="AI Response"
                description="The model generates an answer with source citations."
                badge="Output"
              />

            </TreeBranch>

          </div>

        </CardContent>

      </Card>


      {/* =====================================================
          RAG WORKFLOW
      ===================================================== */}

      <Card className="overflow-hidden">

        <CardContent className="p-5 sm:p-7">

          <SectionHeader
            icon={<Database />}
            title="RAG / Indexing Workflow"
            description="How repository source code becomes searchable AI context."
          />


          <div className="mt-8">

            <RagStep
              number="01"
              icon={<Upload />}
              title="Repository Fetch"
              description="DevPilot fetches the selected GitHub repository and its source files."
              details={[
                "Repository metadata",
                "Source files",
                "File paths",
                "Programming languages",
              ]}
            />


            <RagConnector />


            <RagStep
              number="02"
              icon={<FileCode2 />}
              title="Code Extraction"
              description="Relevant source files are read and converted into text documents."
              details={[
                "Read source files",
                "Preserve file paths",
                "Track line numbers",
                "Identify language",
              ]}
            />


            <RagConnector />


            <RagStep
              number="03"
              icon={<Code2 />}
              title="Chunking"
              description="Large source files are divided into smaller meaningful code chunks."
              details={[
                "Split large files",
                "Create manageable chunks",
                "Keep source metadata",
                "Store line ranges",
              ]}
            />


            <RagConnector />


            <RagStep
              number="04"
              icon={<BrainCircuit />}
              title="Embedding Generation"
              description="Each code chunk is converted into a numerical vector representation."
              details={[
                "Generate embeddings",
                "Represent code semantically",
                "Prepare for similarity search",
              ]}
            />


            <RagConnector />


            <RagStep
              number="05"
              icon={<Database />}
              title="Vector Database"
              description="Embeddings and metadata are stored in the vector database."
              details={[
                "Vector embedding",
                "Repository ID",
                "File path",
                "Start / end lines",
                "Language",
              ]}
              highlighted
            />


            <RagConnector />


            <RagStep
              number="06"
              icon={<Search />}
              title="Similarity Search"
              description="When the user asks a question, the most relevant code chunks are retrieved."
              details={[
                "Convert question into search",
                "Filter by repository",
                "Find similar chunks",
                "Return top relevant context",
              ]}
            />


            <RagConnector />


            <RagStep
              number="07"
              icon={<Bot />}
              title="AI Context + Response"
              description="Retrieved code context is sent to the AI model to generate a grounded answer."
              details={[
                "Relevant code context",
                "User question",
                "AI reasoning",
                "Source citations",
              ]}
              badge="Final"
            />

          </div>

        </CardContent>

      </Card>


      {/* =====================================================
          CHAT FLOW
      ===================================================== */}

      <Card>

        <CardContent className="p-5 sm:p-7">

          <SectionHeader
            icon={<MessageSquare />}
            title="Chat Request Flow"
            description="What happens when you ask a question about your repository."
          />


          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <InfoCard
              icon={<MessageSquare />}
              step="01"
              title="Question"
              description="You ask something about your codebase."
            />

            <InfoCard
              icon={<Search />}
              step="02"
              title="Retrieve"
              description="Relevant code chunks are searched from the vector database."
            />

            <InfoCard
              icon={<BrainCircuit />}
              step="03"
              title="Generate"
              description="AI uses the retrieved context to formulate the answer."
            />

            <InfoCard
              icon={<CheckCircle2 />}
              step="04"
              title="Answer"
              description="You receive a formatted answer with source references."
            />

          </div>

        </CardContent>

      </Card>


      {/* =====================================================
          ARCHITECTURE
      ===================================================== */}

      <Card>

        <CardContent className="p-5 sm:p-7">

          <SectionHeader
            icon={<Server />}
            title="System Architecture"
            description="The major components working together."
          />


          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <ArchitectureCard
              icon={<GithubIcon />}
              title="GitHub"
              description="Authentication and repository source."
            />

            <ArchitectureCard
              icon={<Server />}
              title="Spring Boot"
              description="Backend APIs, authentication and business logic."
            />

            <ArchitectureCard
              icon={<Database />}
              title="Vector Store"
              description="Stores embeddings and searchable code context."
            />

            <ArchitectureCard
              icon={<Bot />}
              title="AI Model"
              description="Generates context-aware answers."
            />

          </div>

        </CardContent>

      </Card>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="pb-6 text-center">

        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">

          <Zap className="h-3.5 w-3.5" />

          GitHub → RAG → Vector Search → AI → Answer

        </div>

      </div>

    </div>
  );
}


// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">

        {icon}

      </div>

      <div className="min-w-0">

        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// FLOW NODE
// =====================================================

function FlowNode({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex w-36 shrink-0 flex-col items-center text-center">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-background shadow-sm">

        {icon}

      </div>

      <p className="mt-3 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs leading-4 text-muted-foreground">
        {description}
      </p>

    </div>
  );
}


// =====================================================
// FLOW ARROW
// =====================================================

function FlowArrow() {
  return (
    <div className="flex shrink-0 items-center">

      <ArrowRight className="h-5 w-5 text-muted-foreground" />

    </div>
  );
}


// =====================================================
// TREE ROOT
// =====================================================

function TreeRoot({
  icon,
  title,
  description,
  badge,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">

        {icon}

      </div>

      <div className="min-w-0">

        <div className="flex flex-wrap items-center gap-2">

          <p className="font-semibold">
            {title}
          </p>

          {badge && (
            <Badge variant="secondary">
              {badge}
            </Badge>
          )}

        </div>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// TREE LINE
// =====================================================

function TreeLine() {
  return (
    <div className="ml-[21px] h-8 border-l-2 border-dashed border-muted-foreground/25" />
  );
}


// =====================================================
// TREE BRANCH
// =====================================================

function TreeBranch({ children }) {
  return (
    <div className="relative ml-5 border-l-2 border-dashed border-muted-foreground/25 pl-6 sm:ml-8 sm:pl-8">

      {children}

    </div>
  );
}


// =====================================================
// TREE NODE
// =====================================================

function TreeNode({
  icon,
  title,
  description,
  badge,
  highlighted = false,
}) {
  return (
    <div
      className={`
        relative
        rounded-xl
        border
        p-4
        transition-colors
        ${
          highlighted
            ? "border-primary/40 bg-primary/5"
            : "bg-background hover:bg-muted/40"
        }
      `}
    >

      {/* branch connector */}

      <div className="absolute -left-[34px] top-1/2 hidden w-8 border-t-2 border-dashed border-muted-foreground/25 sm:block" />

      <div className="flex items-start gap-3">

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${
              highlighted
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }
          `}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="text-sm font-semibold">
              {title}
            </h3>

            {badge && (
              <Badge
                variant={
                  highlighted
                    ? "default"
                    : "secondary"
                }
                className="text-[10px]"
              >
                {badge}
              </Badge>
            )}

          </div>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

        </div>

        <ChevronRight className="mt-1 hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />

      </div>

    </div>
  );
}


// =====================================================
// RAG STEP
// =====================================================

function RagStep({
  number,
  icon,
  title,
  description,
  details = [],
  highlighted = false,
  badge,
}) {
  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        sm:p-5
        ${
          highlighted
            ? "border-primary/40 bg-primary/5"
            : "bg-background"
        }
      `}
    >

      <div className="flex items-start gap-3 sm:gap-4">

        {/* NUMBER */}

        <div className="hidden shrink-0 text-xs font-semibold text-muted-foreground sm:block sm:w-7">

          {number}

        </div>


        {/* ICON */}

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            ${
              highlighted
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }
          `}
        >

          {icon}

        </div>


        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-semibold">
              {title}
            </h3>

            {badge && (
              <Badge>
                {badge}
              </Badge>
            )}

          </div>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>


          {details.length > 0 && (

            <div className="mt-4 flex flex-wrap gap-2">

              {details.map((item) => (

                <Badge
                  key={item}
                  variant="outline"
                  className="font-normal"
                >
                  {item}
                </Badge>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


// =====================================================
// RAG CONNECTOR
// =====================================================

function RagConnector() {
  return (
    <div className="flex h-8 items-center justify-center">

      <ArrowDown className="h-4 w-4 text-muted-foreground" />

    </div>
  );
}


// =====================================================
// INFO CARD
// =====================================================

function InfoCard({
  icon,
  step,
  title,
  description,
}) {
  return (
    <div className="rounded-xl border p-4">

      <div className="flex items-center justify-between">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">

          {icon}

        </div>

        <span className="text-xs font-medium text-muted-foreground">
          {step}
        </span>

      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

    </div>
  );
}


// =====================================================
// ARCHITECTURE CARD
// =====================================================

function ArchitectureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-xl border p-4 transition-colors hover:bg-muted/40">

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">

        {icon}

      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

    </div>
  );
}


export default OverviewPage;