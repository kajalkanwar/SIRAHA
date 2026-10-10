function AdminStatCard({
  label,
  value,
  description,
  icon: Icon,
  accent = "brown",
}) {
  const accentStyles = {
    brown: {
      iconBg: "bg-[#F2EBDD]",
      iconColor: "text-[#5A3026]",
    },

    gold: {
      iconBg: "bg-[#F5EDDC]",
      iconColor: "text-[#A98243]",
    },

    cream: {
      iconBg: "bg-[#F7F3EC]",
      iconColor: "text-[#795033]",
    },

    danger: {
      iconBg: "bg-[#F5E9E5]",
      iconColor: "text-[#925C4D]",
    },
  };

  const currentAccent =
    accentStyles[accent] || accentStyles.brown;

  return (
    <div
      className="
        border
        border-[#EAE2D5]
        bg-[#FFFDF9]
        p-5
        shadow-[0_8px_30px_rgba(67,35,28,0.035)]
        transition
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_14px_35px_rgba(67,35,28,0.07)]
        sm:p-6
      "
    >

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.17em]
              text-[#918477]
            "
          >
            {label}
          </p>

          <h3
            className="
              mt-3
              font-serif
              text-3xl
              font-medium
              text-[#43231C]
              sm:text-[34px]
            "
          >
            {value}
          </h3>

        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            ${currentAccent.iconBg}
            ${currentAccent.iconColor}
          `}
        >
          <Icon size={19} strokeWidth={1.6} />
        </div>

      </div>

      {description && (
        <p
          className="
            mt-4
            border-t
            border-[#EAE2D5]
            pt-3
            text-[11px]
            leading-relaxed
            text-[#918477]
          "
        >
          {description}
        </p>
      )}

    </div>
  );
}

export default AdminStatCard;