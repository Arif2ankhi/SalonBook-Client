// import Link from "next/link";
// import { ArrowLeft, XCircle } from "lucide-react";

// export default function PaymentCancelPage() {
//   return (
//     <div className="mx-auto my-14 w-full max-w-lg px-4">
//       <div className="overflow-hidden rounded-3xl border border-[#EAE2DC] bg-white shadow-sm">
//         <div className="bg-rose-50 px-6 py-9 text-center">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
//             <XCircle className="h-6 w-6" />
//           </div>
//           <h1 className="mt-4 font-serif text-3xl font-bold text-[#2D1A22]">
//             Payment cancelled
//           </h1>
//           <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-neutral-600">
//             No charges were made. Your confirmed appointment remains unpaid and you can complete payment anytime from your dashboard.
//           </p>
//         </div>

//         <div className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center">
//           <Link
//             href="/dashboard/customer/appointments"
//             className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4A2535] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#3A1C29]"
//           >
//             <ArrowLeft className="h-3.5 w-3.5" />
//             Return to My appointments
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }