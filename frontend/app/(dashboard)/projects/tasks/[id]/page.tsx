"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  ListTodo,
  ArrowLeft,
  Edit,
  Calendar,
  User,
  Flag,
  FolderKanban,
  MessageSquare,
  Paperclip,
  Clock,
  CheckCircle,
  Send,
} from "lucide-react";

const taskData = {
  id: "TSK-047",
  title: "Implement user authentication flow",
  description:
    "Build the complete user authentication system including login, registration, password reset, and email verification. Use JWT tokens with refresh token rotation for security. Include rate limiting on auth endpoints.",
  project: "E-Commerce Platform Redesign",
  projectId: "PRJ-001",
  assignee: { name: "Mike Johnson", avatar: "MJ", role: "Lead Developer" },
  reporter: "Sarah Chen",
  priority: "High",
  priorityVariant: "warning" as const,
  status: "In Progress",
  statusVariant: "info" as const,
  dueDate: "Jun 22, 2024",
  createdDate: "Jun 10, 2024",
  labels: ["Backend", "Security"],
  estimatedHours: 16,
  loggedHours: 10,
  subtasks: [
    { name: "Set up JWT infrastructure", done: true },
    { name: "Implement login endpoint", done: true },
    { name: "Implement registration flow", done: true },
    { name: "Add password reset functionality", done: false },
    { name: "Add email verification", done: false },
    { name: "Write unit tests", done: false },
  ],
  comments: [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "SC",
      text: "Please make sure we implement rate limiting from the start. Security review is scheduled for next week.",
      time: "2 hours ago",
      isInternal: false,
    },
    {
      id: 2,
      author: "Mike Johnson",
      avatar: "MJ",
      text: "Good point. I'll add rate limiting using Redis. Already have the infrastructure set up from the CI/CD project.",
      time: "1 hour ago",
      isInternal: false,
    },
    {
      id: 3,
      author: "Mike Johnson",
      avatar: "MJ",
      text: "Note: Need to check if we should use refresh token rotation or sliding sessions. Will confirm with security team.",
      time: "45 min ago",
      isInternal: true,
    },
  ],
  activity: [
    { user: "Mike Johnson", action: "moved to In Progress", time: "3 hours ago" },
    { user: "Sarah Chen", action: "added comment", time: "2 hours ago" },
    { user: "Mike Johnson", action: "checked 'Implement registration flow'", time: "1 hour ago" },
    { user: "Mike Johnson", action: "added internal note", time: "45 min ago" },
  ],
};

export default function TaskDetailPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [newComment, setNewComment] = useState("");

  const completedSubtasks = taskData.subtasks.filter((s) => s.done).length;
  const subtaskProgress = (completedSubtasks / taskData.subtasks.length) * 100;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title={taskData.title}
        description={taskData.id}
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Tasks", href: "/projects/tasks" },
          { label: taskData.id },
        ]}
        icon={<ListTodo className="h-6 w-6 text-primary" />}
        actions={
          <div className="flex items-center gap-3">
            <a
              href="/projects/tasks"
              className="border border-border bg-muted text-foreground px-4 py-2 rounded-lg font-medium transition-all hover:bg-muted/80 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-primary-hover active:scale-95 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Task
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-border">
            {[
              { id: "details", label: "Details" },
              { id: "comments", label: `Comments (${taskData.comments.length})` },
              { id: "activity", label: "Activity" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {taskData.description}
                </p>
              </div>

              {/* Subtasks */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Subtasks</h3>
                  <span className="text-sm text-muted-foreground">
                    {completedSubtasks}/{taskData.subtasks.length}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: `${subtaskProgress}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {taskData.subtasks.map((sub, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={sub.done}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span
                        className={`text-sm ${
                          sub.done
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {sub.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="space-y-4">
              {/* Comment Input */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    SC
                  </div>
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-primary-hover transition-colors">
                        <Send className="h-3.5 w-3.5" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {taskData.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`rounded-2xl border bg-card p-4 shadow-sm ${
                    comment.isInternal
                      ? "border-warning/30 bg-warning/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">
                          {comment.author}
                        </span>
                        {comment.isInternal && (
                          <span className="text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded">
                            Internal Note
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {comment.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                {taskData.activity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status & Priority */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Status
              </label>
              <StatusBadge
                status={taskData.status}
                variant={taskData.statusVariant}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Priority
              </label>
              <StatusBadge
                status={taskData.priority}
                variant={taskData.priorityVariant}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Project
              </label>
              <a
                href={`/projects/projects/${taskData.projectId}`}
                className="text-sm text-primary hover:underline"
              >
                {taskData.project}
              </a>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Assignee
              </label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  {taskData.assignee.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {taskData.assignee.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {taskData.assignee.role}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Reporter
              </label>
              <p className="text-sm">{taskData.reporter}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Due Date
              </label>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{taskData.dueDate}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Time Tracking
              </label>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">
                  {taskData.loggedHours}h logged
                </span>
                <span>{taskData.estimatedHours}h estimated</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-info rounded-full"
                  style={{
                    width: `${(taskData.loggedHours / taskData.estimatedHours) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Labels
              </label>
              <div className="flex flex-wrap gap-1.5">
                {taskData.labels.map((label) => (
                  <span
                    key={label}
                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
