import {
  BookOpen,
  FlaskConical,
  Palette,
  Landmark,
  Sigma,
  Leaf,
  PenLine,
  Music,
  Atom,
  Globe,
  Brain,
  Code,
} from "lucide-react";

const ICONS = {
  BookOpen,
  FlaskConical,
  Palette,
  Landmark,
  Sigma,
  Leaf,
  PenLine,
  Music,
  Atom,
  Globe,
  Brain,
  Code,
};

export default function SubjectIcon({ icon, size = 20, className }) {
  const Icon = ICONS[icon] || BookOpen;
  return <Icon size={size} className={className} />;
}
