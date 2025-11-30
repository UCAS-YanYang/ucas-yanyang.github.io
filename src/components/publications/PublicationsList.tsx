'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon,
    CodeBracketIcon, 
    PresentationChartBarIcon, 
    GlobeAltIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';



interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    // Filter Logic
    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const authorString = pub.authors.map(a => a.name).join(' ');
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                authorString.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;
            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    // 加粗逻辑
    const renderAuthors = (authors: { name: string }[]) => {
        return authors.map((author, index) => {
            const name = author.name;
            const isMe = name.toLowerCase().includes("yan") && name.toLowerCase().includes("yang");
            return (
                <span key={index}>
                    {isMe ? (
                        <strong className="font-bold text-black dark:text-white border-b border-transparent">
                            {name}
                        </strong>
                    ) : (
                        <span className="text-neutral-600 dark:text-neutral-400">
                            {name}
                        </span>
                    )}
                    {index < authors.length - 1 && ", "}
                </span>
            );
        });
    };

    // 🔥 统一的按钮样式 (白底、灰边框)
    const buttonClass = "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700";
    const activeButtonClass = "bg-neutral-100 text-black border-neutral-300 dark:bg-neutral-700 dark:text-white";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="mb-8">
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>{config.description}</p>}
            </div>

            {/* Search Controls */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input type="text" placeholder="Search publications..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={cn("flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200", showFilters ? "bg-accent text-white border-accent" : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-accent hover:text-accent")}>
                        <FunnelIcon className="h-5 w-5 mr-2" /> Filters
                    </button>
                </div>
                <AnimatePresence>
                    {showFilters && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center"><CalendarIcon className="h-4 w-4 mr-1" /> Year</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => setSelectedYear('all')} className={cn("px-3 py-1 text-xs rounded-full transition-colors", selectedYear === 'all' ? "bg-accent text-white" : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100")}>All</button>
                                        {years.map(year => <button key={year} onClick={() => setSelectedYear(year)} className={cn("px-3 py-1 text-xs rounded-full transition-colors", selectedYear === year ? "bg-accent text-white" : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100")}>{year}</button>)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center"><BookOpenIcon className="h-4 w-4 mr-1" /> Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => setSelectedType('all')} className={cn("px-3 py-1 text-xs rounded-full transition-colors", selectedType === 'all' ? "bg-accent text-white" : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100")}>All</button>
                                        {types.map(type => <button key={type} onClick={() => setSelectedType(type)} className={cn("px-3 py-1 text-xs rounded-full capitalize transition-colors", selectedType === type ? "bg-accent text-white" : "bg-white dark:bg-neutral-800 text-neutral-600 hover:bg-neutral-100")}>{type.replace('-', ' ')}</button>)}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* List */}
            <div className="space-y-6">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">No publications found matching your criteria.</div>
                ) : (
                    filteredPublications.map((pub, index) => (
                        <motion.div key={pub.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 * index }} className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all duration-200">
                            <div className="flex flex-col md:flex-row gap-6">
                                {pub.preview && (
                                    <div className="w-full md:w-48 flex-shrink-0">
                                        <div className="aspect-video md:aspect-[4/3] relative rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100">
                                            <Image src={`/papers/${pub.preview}`} alt={pub.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow flex flex-col">
                                    <h3 className={`${embedded ? "text-lg" : "text-xl"} font-bold text-primary mb-2 leading-tight`}>{pub.title}</h3>
                                    
                                    <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-400 mb-2 leading-relaxed`}>
                                        {renderAuthors(pub.authors)}
                                    </p>
                                    
                                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-600 mb-3 italic">{pub.journal || pub.conference} {pub.year}</p>
                                    {pub.description && <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-4 line-clamp-3">{pub.description}</p>}

                                    {/* 🔥🔥🔥 按钮区域：统一白底样式 🔥🔥🔥 */}
                                    <div className="flex flex-wrap gap-2 mt-auto">

                                    {/* Website (新增) */}
                                    {(pub.website || pub.link) && (
                                        <a href={pub.website || pub.link} target="_blank" rel="noopener noreferrer" 
                                        className={buttonClass}>
                                        <GlobeAltIcon className="h-3.5 w-3.5 mr-1.5 text-neutral-500" /> 
                                        Website
                                        </a>
                                    )}

                                    {/* Code */}
                                    {pub.code && (
                                        <a href={pub.code} target="_blank" rel="noopener noreferrer" 
                                        className={buttonClass}>
                                        <CodeBracketIcon className="h-3.5 w-3.5 mr-1.5 text-neutral-500" /> 
                                        Code
                                        </a>
                                    )}

                                    {pub.preprint && (
                                        <a href={pub.preprint} target="_blank" rel="noopener noreferrer" 
                                        className={buttonClass}>
                                        {/* 这里换成了 NewspaperIcon */}
                                        <SparklesIcon className="h-3.5 w-3.5 mr-1.5 text-neutral-500" /> 
                                        Preprint
                                        </a>
                                    )}

                                    {/* Slides (新增) */}
                                    {pub.slides && (
                                        <a href={pub.slides} target="_blank" rel="noopener noreferrer" 
                                        className={buttonClass}>
                                        <PresentationChartBarIcon className="h-3.5 w-3.5 mr-1.5 text-neutral-500" /> 
                                        Slides
                                        </a>
                                    )}

                                        {pub.abstract && (
                                            <button onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)} 
                                                    className={cn(buttonClass, expandedAbstractId === pub.id && activeButtonClass)}>
                                                <DocumentTextIcon className="h-3 w-3 mr-1.5 text-neutral-500" /> Abstract
                                            </button>
                                        )}

                                        {pub.bibtex && (
                                            <button onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)} 
                                                    className={cn(buttonClass, expandedBibtexId === pub.id && activeButtonClass)}>
                                                <BookOpenIcon className="h-3 w-3 mr-1.5 text-neutral-500" /> BibTeX
                                            </button>
                                        )}
                                    </div>

                                    {/* 展开区域 (Abstract & BibTeX) */}
                                    <AnimatePresence>
                                        {expandedAbstractId === pub.id && pub.abstract && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4"><div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600">{pub.abstract}</div></motion.div>}
                                        {expandedBibtexId === pub.id && pub.bibtex && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-4"><div className="relative bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700"><pre className="text-xs text-neutral-600 overflow-x-auto whitespace-pre-wrap font-mono">{pub.bibtex}</pre><button onClick={() => navigator.clipboard.writeText(pub.bibtex || '')} className="absolute top-2 right-2 p-1.5 rounded-md bg-white border hover:bg-neutral-100" title="Copy"><ClipboardDocumentIcon className="h-4 w-4 text-neutral-500" /></button></div></motion.div>}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}