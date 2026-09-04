import { getSchemeClasses, type ColorScheme } from "@/lib/color-schemes";

interface SubprocessorRow {
  supplier?: string;
  type?: string;
  description?: string;
  locations?: string;
}

interface SubprocessorTableProps {
  scheme?: ColorScheme;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  effectiveDate?: string;
  rows?: SubprocessorRow[];
}

/**
 * The subprocessor register, as a table.
 *
 * Four columns of mostly-prose at ~28 rows does not survive a horizontal
 * squeeze, so this renders twice: a real <table> from `md` up, and a stacked
 * definition list below it. Both come from the same data — no `hidden` copy
 * that can drift — and only one is ever in the layout, so screen readers meet
 * a single copy too.
 */
export function SubprocessorTable({
  scheme = "light",
  eyebrow,
  heading,
  intro,
  effectiveDate,
  rows = [],
}: SubprocessorTableProps) {
  const entries = rows.filter((r) => r?.supplier);

  return (
    <section className={`py-16 md:py-20 ${getSchemeClasses(scheme)}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-widest text-ac-blue mb-3">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-ac-black">
              {heading}
            </h2>
          )}
          {intro && (
            <p className="text-base md:text-lg font-light leading-relaxed max-w-3xl text-ac-black/70">
              {intro}
            </p>
          )}
          {effectiveDate && (
            <p className="text-sm font-light mt-4 text-ac-black/60">
              Version dated {effectiveDate}
            </p>
          )}

          {entries.length > 0 && (
            <>
              {/* Desktop: a real table. Scrolls inside its own box rather than
                  pushing the page sideways if the viewport is still tight. */}
              <div className="hidden md:block mt-10 overflow-x-auto rounded-2xl border border-black/10">
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">
                    Subprocessors engaged to process personal data, with the type of
                    supplier, the service provided, and the locations from which
                    personal data is processed.
                  </caption>
                  <thead>
                    <tr className="bg-ac-blue/5">
                      <th scope="col" className="px-5 py-4 text-sm font-bold text-ac-black align-bottom w-[22%]">
                        Supplier
                      </th>
                      <th scope="col" className="px-5 py-4 text-sm font-bold text-ac-black align-bottom w-[14%]">
                        Type
                      </th>
                      <th scope="col" className="px-5 py-4 text-sm font-bold text-ac-black align-bottom">
                        Description
                      </th>
                      <th scope="col" className="px-5 py-4 text-sm font-bold text-ac-black align-bottom w-[20%]">
                        Locations
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((row, i) => (
                      <tr
                        key={`${row.supplier}-${i}`}
                        className="border-t border-black/10 align-top"
                      >
                        <th
                          scope="row"
                          className="px-5 py-4 text-sm font-bold text-ac-black text-left"
                        >
                          {row.supplier}
                        </th>
                        <td className="px-5 py-4 text-sm text-ac-black/70 font-light whitespace-nowrap">
                          {row.type}
                        </td>
                        <td className="px-5 py-4 text-sm text-ac-black/70 font-light leading-relaxed">
                          {row.description}
                        </td>
                        <td className="px-5 py-4 text-sm text-ac-black/70 font-light">
                          {row.locations}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: one card per subprocessor. */}
              <ul className="md:hidden mt-8 space-y-4">
                {entries.map((row, i) => (
                  <li
                    key={`${row.supplier}-${i}`}
                    className="rounded-2xl border border-black/10 p-5"
                  >
                    <p className="text-base font-bold text-ac-black">{row.supplier}</p>
                    {row.type && (
                      <p className="text-[11px] font-bold uppercase tracking-widest text-ac-blue mt-1">
                        {row.type}
                      </p>
                    )}
                    {row.description && (
                      <p className="text-sm text-ac-black/70 font-light leading-relaxed mt-3">
                        {row.description}
                      </p>
                    )}
                    {row.locations && (
                      <p className="text-sm text-ac-black/60 font-light mt-3">
                        <span className="font-medium text-ac-black/80">Locations: </span>
                        {row.locations}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
