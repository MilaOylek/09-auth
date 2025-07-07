import css from "./SidebarNotes.module.css";
import Link from "next/link";

export const NOTE_CATEGORIES = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

const SidebarNotes: React.FC = () => {
  return (
    <ul className={css.menuList}>
      {NOTE_CATEGORIES.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
