import { useEffect, useState } from "react";

import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../constants/api";

function AnnouncementManagement() {
  const [announcements, setAnnouncements] =
    useState([]);

  const [newText, setNewText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editingText, setEditingText] =
    useState("");


  /*
    =====================================================
    INITIAL LOAD
    =====================================================
  */

  useEffect(() => {
    let cancelled = false;

    const fetchAnnouncements = async () => {
      try {
        const data =
          await getAnnouncements();

        if (cancelled) {
          return;
        }

        setAnnouncements(data);
        setError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Announcement loading error:",
          error
        );

        setError(
          error.message ||
            "Failed to load announcements."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      cancelled = true;
    };
  }, []);


  /*
    =====================================================
    RELOAD AFTER ADMIN ACTION
    =====================================================
  */

  const loadAnnouncements = async () => {
    try {
      const data =
        await getAnnouncements();

      setAnnouncements(data);
      setError("");
    } catch (error) {
      console.error(
        "Announcement loading error:",
        error
      );

      setError(
        error.message ||
          "Failed to load announcements."
      );
    }
  };


  /*
    =====================================================
    CREATE
    =====================================================
  */

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!newText.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createAnnouncement({
        text: newText.trim(),
        isActive: true,
        order:
          announcements.length + 1,
      });

      setNewText("");

      await loadAnnouncements();
    } catch (error) {
      console.error(
        "Create announcement error:",
        error
      );

      setError(
        error.message ||
          "Failed to create announcement."
      );
    } finally {
      setSaving(false);
    }
  };


  /*
    =====================================================
    START EDIT
    =====================================================
  */

  const handleStartEdit = (
    announcement
  ) => {
    setEditingId(
      announcement._id
    );

    setEditingText(
      announcement.text
    );
  };


  /*
    =====================================================
    CANCEL EDIT
    =====================================================
  */

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };


  /*
    =====================================================
    SAVE EDIT
    =====================================================
  */

  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateAnnouncement(id, {
        text: editingText.trim(),
      });

      setEditingId(null);
      setEditingText("");

      await loadAnnouncements();
    } catch (error) {
      console.error(
        "Update announcement error:",
        error
      );

      setError(
        error.message ||
          "Failed to update announcement."
      );
    } finally {
      setSaving(false);
    }
  };


  /*
    =====================================================
    ACTIVATE / DEACTIVATE
    =====================================================
  */

  const handleToggle = async (
    announcement
  ) => {
    try {
      setError("");

      await updateAnnouncement(
        announcement._id,
        {
          isActive:
            !announcement.isActive,
        }
      );

      await loadAnnouncements();
    } catch (error) {
      console.error(
        "Toggle announcement error:",
        error
      );

      setError(
        error.message ||
          "Failed to update announcement."
      );
    }
  };


  /*
    =====================================================
    DELETE
    =====================================================
  */

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Delete this announcement?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteAnnouncement(id);

      await loadAnnouncements();
    } catch (error) {
      console.error(
        "Delete announcement error:",
        error
      );

      setError(
        error.message ||
          "Failed to delete announcement."
      );
    }
  };


  /*
    =====================================================
    LOADING
    =====================================================
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] p-8">
        <p className="font-['Poppins'] text-sm text-[#71655B]">
          Loading announcements...
        </p>
      </div>
    );
  }


  /*
    =====================================================
    UI
    =====================================================
  */

  return (
    <div className="min-h-screen bg-[#FAF7F0] p-5 sm:p-8">
      <div className="mx-auto max-w-[1000px]">

        {/* Page heading */}

        <div className="mb-8">
          <p className="mb-2 font-['Poppins'] text-[9px] font-medium uppercase tracking-[2.5px] text-[#A98243]">
            Website Settings
          </p>

          <h1 className="font-['Cormorant_Garamond'] text-[36px] text-[#43231C]">
            Announcement Bar
          </h1>

          <p className="mt-2 font-['Poppins'] text-sm text-[#71655B]">
            Manage the messages displayed at
            the top of the Sirraha website.
          </p>
        </div>


        {/* Error */}

        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* Add announcement */}

        <form
          onSubmit={handleCreate}
          className="mb-8 border border-[#DED4C4] bg-[#FFFDF9] p-5 sm:p-6"
        >
          <h2 className="mb-4 font-['Cormorant_Garamond'] text-[25px] text-[#43231C]">
            Add New Announcement
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newText}
              onChange={(event) =>
                setNewText(
                  event.target.value
                )
              }
              placeholder="Enter announcement text..."
              className="min-h-[46px] flex-1 border border-[#DED4C4] bg-[#FAF7F0] px-4 text-sm text-[#3A2A20] outline-none focus:border-[#C8A15A]"
            />

            <button
              type="submit"
              disabled={
                saving ||
                !newText.trim()
              }
              className="min-h-[46px] bg-[#5A3026] px-6 font-['Poppins'] text-[9px] font-medium uppercase tracking-[1.8px] text-[#FFFDF9] transition hover:bg-[#43231C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add"}
            </button>
          </div>
        </form>


        {/* Existing announcements */}

        <div className="space-y-4">

          {announcements.length === 0 ? (
            <div className="border border-[#DED4C4] bg-[#FFFDF9] p-8 text-center">
              <p className="font-['Poppins'] text-sm text-[#71655B]">
                No announcements found.
              </p>
            </div>
          ) : (
            announcements.map(
              (
                announcement,
                index
              ) => (
                <div
                  key={
                    announcement._id
                  }
                  className="border border-[#DED4C4] bg-[#FFFDF9] p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-5">

                    {/* Top row */}

                    <div className="flex items-center justify-between">
                      <span className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[1.5px] text-[#A98243]">
                        Announcement{" "}
                        {index + 1}
                      </span>

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          font-['Poppins']
                          text-[8px]
                          font-medium
                          uppercase
                          tracking-[1px]
                          ${
                            announcement.isActive
                              ? "bg-[#5A3026] text-[#FFFDF9]"
                              : "bg-[#F2EBDD] text-[#71655B]"
                          }
                        `}
                      >
                        {announcement.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>


                    {/* Announcement text */}

                    {editingId ===
                    announcement._id ? (
                      <div className="flex flex-col gap-3">

                        <input
                          type="text"
                          value={editingText}
                          onChange={(
                            event
                          ) =>
                            setEditingText(
                              event.target
                                .value
                            )
                          }
                          className="min-h-[46px] w-full border border-[#DED4C4] bg-[#FAF7F0] px-4 text-sm text-[#3A2A20] outline-none focus:border-[#C8A15A]"
                        />

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleSaveEdit(
                                announcement._id
                              )
                            }
                            disabled={saving}
                            className="bg-[#5A3026] px-5 py-2.5 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.5px] text-[#FFFDF9]"
                          >
                            {saving
                              ? "Saving..."
                              : "Save"}
                          </button>

                          <button
                            type="button"
                            onClick={
                              handleCancelEdit
                            }
                            className="border border-[#DED4C4] px-5 py-2.5 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.5px] text-[#5A3026]"
                          >
                            Cancel
                          </button>

                        </div>
                      </div>
                    ) : (
                      <p className="font-['Poppins'] text-sm leading-7 text-[#3A2A20]">
                        {announcement.text}
                      </p>
                    )}


                    {/* Actions */}

                    <div className="flex flex-wrap gap-2 border-t border-[#EAE2D5] pt-4">

                      <button
                        type="button"
                        onClick={() =>
                          handleStartEdit(
                            announcement
                          )
                        }
                        className="border border-[#DED4C4] px-4 py-2 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.4px] text-[#5A3026] transition hover:border-[#C8A15A]"
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleToggle(
                            announcement
                          )
                        }
                        className="border border-[#DED4C4] px-4 py-2 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.4px] text-[#5A3026] transition hover:border-[#C8A15A]"
                      >
                        {announcement.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            announcement._id
                          )
                        }
                        className="border border-red-200 px-4 py-2 font-['Poppins'] text-[8px] font-medium uppercase tracking-[1.4px] text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              )
            )
          )}

        </div>
      </div>
    </div>
  );
}

export default AnnouncementManagement;