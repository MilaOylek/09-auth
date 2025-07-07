"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

const tags = ["All", "Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={css.menuContainer}>
      <button
        onClick={toggleMenu}
        className={css.menuButton}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={ `/notes/filter/${tag}`}
                onClick={toggleMenu}
                className={css.menuLink}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
