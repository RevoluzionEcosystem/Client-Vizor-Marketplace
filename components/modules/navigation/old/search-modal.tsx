// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function SearchModal() {
//     const [open, setOpen] = useState(false);
//     const [query, setQuery] = useState("");
//     const [results, setResults] = useState<string[]>([]);

//     const handleSearch = () => {
//         // Replace this with your search logic.
//         // For now, simulate search results.
//         const dummyResults = [
//             "Home Page",
//         ].filter((item) => item.toLowerCase().includes(query.toLowerCase()));
//         setResults(dummyResults);
//     };

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 {/* Make the input look like a normal search input but readOnly so it immediately triggers the modal */}
//                 <div onClick={() => setOpen(true)} className="w-full">
//                     <Input placeholder="Search Site..." readOnly className="cursor-pointer" />
//                 </div>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[600px]">
//                 <DialogHeader>
//                     <DialogTitle>Vizor Site Search</DialogTitle>
//                     <DialogDescription>
//                         Enter your query to search through our dApp.
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="flex gap-2 mt-4">
//                     <Input
//                         autoFocus
//                         placeholder="Type to search..."
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                     />
//                     <Button onClick={handleSearch}>Search</Button>
//                 </div>
//                 <div className="mt-6">
//                     {query && results.length === 0 && (
//                         <p className="text-sm text-gray-500">No results found for "{query}".</p>
//                     )}
//                     {results.length > 0 && (
//                         <ul>
//                             {results.map((item, idx) => (
//                                 <li key={idx} className="py-2 border-b border-gray-200">
//                                     {item}
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
