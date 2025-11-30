'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
// 引入所有需要的图标
import { 
    CodeBracketIcon, 
    PresentationChartBarIcon, 
    GlobeAltIcon, 
    DocumentTextIcon, 
    BookOpenIcon,
    ClipboardDocumentIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { cn } from '@/lib/utils'; // 确保你有这个工具函数，如果没有可以直接写字符串

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    // 状态管理：用于控制 Abstract 和 BibTeX 的展开/收起
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

    // 作者名字渲染逻辑 (加粗)
    const renderAuthors = (authors: { name: string }[]) => {
        const MY_NAME_KEYWORDS = ["yan", "yang"]; 
        return authors.map((author: { name: string }, index: number) => {
            const name = author.name;
            const lowerName = name.toLowerCase();
            const isMe = MY_NAME_KEYWORDS.every(k => lowerName.includes(k));

            return (
                <span key={index}>
                    {isMe ? (
                        <strong className="font-bold text-black dark:text-white">
                            {name}
                        </strong>
                    ) : (
                        <span className="text-neutral-600 dark:text-neutral-500">
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
    // 选中状态的样式 (用于展开后的按钮)
    const activeButtonClass = "bg-neutral-100 text-black border-neutral-300 dark:bg-neutral-700 dark:text-white";

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        <h3 className="font-semibold text-primary mb-2 leading-tight">
                            {pub.title}
                        </h3>
                        
                        <div className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                            {renderAuthors(pub.authors)}
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2 italic">
                            {pub.journal || pub.conference} {pub.year}
                        </p>
                        
                        {pub.description && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2 mb-3">
                                {pub.description}
                            </p>
                        )}

                        {/* 🔥 按钮区域：全部使用统一白底样式，并且补全了 Slides 和 Website */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            
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


                            {/* Abstract (可展开) */}
                            {pub.abstract && (
                                <button 
                                    onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                    className={cn(buttonClass, expandedAbstractId === pub.id && activeButtonClass)}
                                >
                                    <DocumentTextIcon className="h-3.5 w-3.5 mr-1.5 text-neutral-500" /> 
                                    Abstract
                                </button>
                            )}

                            {/* BibTeX (可展开) */}
                            {pub.bibtex && (
                                <button 
                                    onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                    className={cn(buttonClass, expandedBibtexId === pub.id && activeButtonClass)}
                                >
                                    <BookOpenIcon className="h-3.5 w-3.5 mr-1.5 text-neutral-500" /> 
                                    BibTeX
                                </button>
                            )}
                        </div>

                        {/* 展开内容：Abstract */}
                        {expandedAbstractId === pub.id && pub.abstract && (
                            <div className="mt-4 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-md border border-neutral-100 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {pub.abstract}
                            </div>
                        )}

                        {/* 展开内容：BibTeX */}
                        {expandedBibtexId === pub.id && pub.bibtex && (
                            <div className="mt-4 relative bg-neutral-50 dark:bg-neutral-800 p-3 rounded-md border border-neutral-100 dark:border-neutral-700 group">
                                <pre className="text-xs text-neutral-600 dark:text-neutral-400 overflow-x-auto whitespace-pre-wrap font-mono">
                                    {pub.bibtex}
                                </pre>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(pub.bibtex || '')} 
                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-white border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100" 
                                    title="Copy"
                                >
                                    <ClipboardDocumentIcon className="h-4 w-4 text-neutral-500" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}