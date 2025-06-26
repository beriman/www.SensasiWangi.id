import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface EditHistoryProps {
  docType: "topic" | "comment";
  docId: string;
}

export default function EditHistory({ docType, docId }: EditHistoryProps) {
  const history = useQuery(api.forum.getEditHistory, { docType, docId });

  if (history === undefined) return <div>Loading...</div>;
  if (history.length === 0)
    return <p className="text-sm text-muted-foreground">No edits</p>;

  return (
    <div className="space-y-2">
      {history.map((edit) => (
        <div key={edit._id} className="border p-2 rounded-md">
          {edit.previousTitle && (
            <div className="font-semibold text-sm">{edit.previousTitle}</div>
          )}
          <div className="whitespace-pre-line text-sm">{edit.previousContent}</div>
          <div className="text-xs text-gray-500">
            {new Date(edit.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
