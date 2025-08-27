import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Award,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  GraduationCap,
  ClipboardList,
  Clock,
  UserCheck,
  PlusCircle,
} from "lucide-react";
import { SidebarConfig } from "@/types/admin";

// superAdmin Dashboard Sidebar Configuration
export const getSuperAdminSidebarConfig = (t: any): SidebarConfig => ({
  header: {
    title: t("superAdmin.sidebar.header.title"),
    subtitle: t("superAdmin.sidebar.header.subtitle"),
    icon: GraduationCap,
  },
  mainMenuItems: [
    {
      id: "dashboard",
      label: t("superAdmin.sidebar.dashboard"),
      icon: LayoutDashboard,
      href: "/superAdmin/dashboard",
    },
    {
      id: "grades",
      label: t("superAdmin.sidebar.grades"),
      icon: Award,
      href: "/superAdmin/dashboard/grades",
    },
    // {
    //   id: "classes",
    //   label: t("superAdmin.sidebar.classes.main"),
    //   icon: Users,
    //   children: [
    //     {
    //       id: "all-classes",
    //       label: t("superAdmin.sidebar.classes.all"),
    //       icon: Users,
    //       href: "/superAdmin/dashboard/classes",
    //     },
    //     {
    //       id: "create-class",
    //       label: t("superAdmin.sidebar.classes.create"),
    //       icon: PlusCircle,
    //       href: "/superAdmin/dashboard/classes/create",
    //     },
    //   ],
    // },
    // {
    //   id: "students",
    //   label: t("superAdmin.sidebar.students.main"),
    //   icon: UserCheck,
    //   children: [
    //     {
    //       id: "all-students",
    //       label: t("superAdmin.sidebar.students.all"),
    //       icon: Users,
    //       href: "/superAdmin/dashboard/students",
    //     },
    //     {
    //       id: "attendance",
    //       label: t("superAdmin.sidebar.students.attendance"),
    //       icon: Clock,
    //       href: "/superAdmin/dashboard/attendance",
    //     },
    //   ],
    // },
    // {
    //   id: "assignments",
    //   label: t("superAdmin.sidebar.assignments.main"),
    //   icon: ClipboardList,
    //   children: [
    //     {
    //       id: "all-assignments",
    //       label: t("superAdmin.sidebar.assignments.all"),
    //       icon: FileText,
    //       href: "/superAdmin/dashboard/assignments",
    //     },
    //     {
    //       id: "create-assignment",
    //       label: t("superAdmin.sidebar.assignments.create"),
    //       icon: PlusCircle,
    //       href: "/superAdmin/dashboard/assignments/create",
    //     },
    //   ],
    // },
    // {
    //   id: "grades",
    //   label: t("superAdmin.sidebar.grades"),
    //   icon: Award,
    //   href: "/superAdmin/dashboard/grades",
    // },
    // {
    //   id: "schedule",
    //   label: t("superAdmin.sidebar.schedule"),
    //   icon: Calendar,
    //   href: "/superAdmin/dashboard/schedule",
    // },
    // {
    //   id: "resources",
    //   label: t("superAdmin.sidebar.resources"),
    //   icon: BookOpen,
    //   href: "/superAdmin/dashboard/resources",
    // },
  ],
  bottomMenuItems: [
    {
      id: "notifications",
      label: t("superAdmin.sidebar.bottom.notifications"),
      icon: Bell,
      href: "/superAdmin/notifications",
      // badge: 3,
    },
    {
      id: "settings",
      label: t("superAdmin.sidebar.bottom.settings"),
      icon: Settings,
      href: "/superAdmin/settings",
    },
    {
      id: "logout",
      label: t("superAdmin.sidebar.bottom.logout"),
      icon: LogOut,
      href: "/logout",
    },
  ],
});

// Student Dashboard Sidebar Configuration
export const getStudentSidebarConfig = (t: any): SidebarConfig => ({
  header: {
    title: t("student.sidebar.header.title"),
    subtitle: t("student.sidebar.header.subtitle"),
    icon: BookOpen,
  },
  mainMenuItems: [
    {
      id: "dashboard",
      label: t("student.sidebar.dashboard"),
      icon: LayoutDashboard,
      href: "/student/dashboard",
    },
    {
      id: "courses",
      label: t("student.sidebar.courses"),
      icon: BookOpen,
      href: "/student/dashboard/courses",
    },
    {
      id: "assignments",
      label: t("student.sidebar.assignments.main"),
      icon: ClipboardList,
      children: [
        {
          id: "pending-assignments",
          label: t("student.sidebar.assignments.pending"),
          icon: Clock,
          href: "/student/dashboard/assignments/pending",
        },
        {
          id: "completed-assignments",
          label: t("student.sidebar.assignments.completed"),
          icon: Award,
          href: "/student/dashboard/assignments/completed",
        },
      ],
    },
    {
      id: "grades",
      label: t("student.sidebar.grades"),
      icon: Award,
      href: "/student/dashboard/grades",
    },
    {
      id: "schedule",
      label: t("student.sidebar.schedule"),
      icon: Calendar,
      href: "/student/dashboard/schedule",
    },
    {
      id: "attendance",
      label: t("student.sidebar.attendance"),
      icon: UserCheck,
      href: "/student/dashboard/attendance",
    },
    {
      id: "library",
      label: t("student.sidebar.library"),
      icon: BookOpen,
      href: "/student/dashboard/library",
    },
  ],
  bottomMenuItems: [
    {
      id: "messages",
      label: t("student.sidebar.bottom.messages"),
      icon: MessageSquare,
      href: "/student/messages",
      // badge: 2,
    },
    {
      id: "notifications",
      label: t("student.sidebar.bottom.notifications"),
      icon: Bell,
      href: "/student/notifications",
      // badge: 4,
    },
    {
      id: "settings",
      label: t("student.sidebar.bottom.settings"),
      icon: Settings,
      href: "/student/settings",
    },
    {
      id: "logout",
      label: t("student.sidebar.bottom.logout"),
      icon: LogOut,
      href: "/logout",
    },
  ],
});
