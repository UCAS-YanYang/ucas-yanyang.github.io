'use client';

import { motion } from 'framer-motion';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'News' }: NewsProps) {

    // 🔥 新增：解析 Markdown 链接的辅助函数
    // 将 "text [link](url) text" 转换为 React 组件数组
    const parseContent = (text: string) => {
        // 1. 使用正则切割字符串，保留链接部分
        // 正则含义：匹配 [任意字符](任意字符)
        const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

        return parts.map((part, index) => {
            // 2. 检查这一段是不是链接格式
            const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

            if (match) {
                // 如果是链接，提取出 [显示文本] 和 (URL)
                const [, linkText, linkUrl] = match;
                return (
                    <a 
                        key={index} 
                        href={linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                        {linkText}
                    </a>
                );
            }

            // 3. 如果不是链接，直接返回普通文本
            return part;
        });
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0 font-mono">
                            {item.date}
                        </span>
                        {/* 🔥 修改这里：调用 parseContent 函数来渲染内容 */}
                        <p className="text-sm text-neutral-700 leading-relaxed">
                            {parseContent(item.content)}
                        </p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}