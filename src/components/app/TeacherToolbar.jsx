export default function TeacherToolbar({
  showEditButton = false,
  onEdit,
  onNewChapter,
  onImport,
  onExport,
  onDelete,
}) {
  return (
    <div className="teacher-toolbar">
      {showEditButton && (
        <button className="btn-edit-chapter" onClick={onEdit}>
          ✏️ Hoofdstuk bewerken
        </button>
      )}
      <button className="btn-new-chapter" onClick={onNewChapter}>
        ➕ Nieuw hoofdstuk
      </button>
      <button className="btn-import-chapter" onClick={onImport}>
        ⬆️ Importeer
      </button>
      {onExport && (
        <button className="btn-export-chapter" onClick={onExport}>
          ⬇️ Exporteer
        </button>
      )}
      {onDelete && (
        <button className="btn-delete-chapter" onClick={onDelete}>
          🗑️ Verwijder hoofdstuk
        </button>
      )}
    </div>
  );
}
