import { jsPDF } from 'jspdf';
import { PostAnalytics } from '../types';

export interface WeeklyReportSummary {
  dateRange: string;
  totalImpressions: number;
  totalEngagements: number;
  avgEngagementRate: number;
  totalShares: number;
  totalClicks: number;
  topChannel: string;
  posts: PostAnalytics[];
  executiveSummary: string;
  keyLearnings: string[];
  recommendations: string[];
}

export function generateWeeklyReportPDF(data: WeeklyReportSummary): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const accentColor: [number, number, number] = [79, 70, 229]; // Indigo 600
  const emeraldColor: [number, number, number] = [16, 185, 129]; // Emerald 500
  const secondaryColor: [number, number, number] = [100, 116, 139]; // Slate 500
  const cardBg: [number, number, number] = [248, 250, 252]; // Slate 50

  // 1. Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, contentWidth, 68, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('OMNIPOST AI — WEEKLY PERFORMANCE AUDIT', margin + 18, y + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Reporting Period: ${data.dateRange}`, margin + 18, y + 50);

  y += 86;

  // 2. Executive KPI Cards Grid (4 boxes)
  const cardWidth = (contentWidth - 30) / 4;
  const cardHeight = 52;
  const metrics = [
    { label: 'TOTAL IMPRESSIONS', value: data.totalImpressions.toLocaleString(), color: primaryColor },
    { label: 'TOTAL ENGAGEMENTS', value: data.totalEngagements.toLocaleString(), color: accentColor },
    { label: 'AVG ENGAGEMENT RATE', value: `${data.avgEngagementRate.toFixed(2)}%`, color: emeraldColor },
    { label: 'SHARES & REPOSTS', value: data.totalShares.toLocaleString(), color: primaryColor },
  ];

  metrics.forEach((m, i) => {
    const cardX = margin + i * (cardWidth + 10);
    doc.setFillColor(...cardBg);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 4, 4, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text(m.label, cardX + 10, y + 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...m.color);
    doc.text(m.value, cardX + 10, y + 38);
  });

  y += 72;

  // 3. Executive AI Summary Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text('Executive Summary & Strategic Analysis', margin, y);
  y += 14;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 62, 4, 4, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const splitSummary = doc.splitTextToSize(data.executiveSummary, contentWidth - 24);
  doc.text(splitSummary, margin + 12, y + 20);

  y += 76;

  // 4. Channel Performance Comparison Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text('Channel Breakdown & Cross-Platform Metrics', margin, y);
  y += 14;

  // Table Header
  const colWidths = [120, 95, 95, 95, 110];
  const tableHeaders = ['Platform', 'Impressions', 'Engagements', 'Eng. Rate', 'Top Asset'];
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  let curX = margin + 10;
  tableHeaders.forEach((th, idx) => {
    doc.text(th, curX, y + 14);
    curX += colWidths[idx];
  });
  y += 22;

  // Aggregate platforms
  const platforms = ['linkedin', 'twitter', 'instagram'] as const;
  platforms.forEach((platformName, idx) => {
    const platformPosts = data.posts.filter((p) => p.platform === platformName);
    const platImpressions = platformPosts.reduce((acc, p) => acc + p.impressions, 0);
    const platEngagements = platformPosts.reduce((acc, p) => acc + p.engagements, 0);
    const rate = platImpressions > 0 ? (platEngagements / platImpressions) * 100 : 0;
    const topPost = platformPosts.sort((a, b) => b.impressions - a.impressions)[0];

    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 22, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 22, margin + contentWidth, y + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);

    let cellX = margin + 10;
    const displayName = platformName === 'twitter' ? 'Twitter / X' : platformName.charAt(0).toUpperCase() + platformName.slice(1);
    doc.text(displayName, cellX, y + 14);
    cellX += colWidths[0];

    doc.text(platImpressions.toLocaleString(), cellX, y + 14);
    cellX += colWidths[1];

    doc.text(platEngagements.toLocaleString(), cellX, y + 14);
    cellX += colWidths[2];

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rate >= 5.5 ? 16 : 30, rate >= 5.5 ? 185 : 41, rate >= 5.5 ? 129 : 59);
    doc.text(`${rate.toFixed(2)}%`, cellX, y + 14);
    cellX += colWidths[3];

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const topPostTitle = topPost ? (topPost.title.length > 20 ? topPost.title.slice(0, 20) + '...' : topPost.title) : 'None';
    doc.text(topPostTitle, cellX, y + 14);

    y += 22;
  });

  y += 24;

  // 5. Key Learnings & Algorithmic Takeaways
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text('Key Algorithmic Learnings from this Cycle', margin, y);
  y += 14;

  data.keyLearnings.forEach((learning) => {
    doc.setFillColor(...accentColor);
    doc.circle(margin + 6, y + 5, 2.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const textLines = doc.splitTextToSize(learning, contentWidth - 20);
    doc.text(textLines, margin + 16, y + 8);
    y += textLines.length * 13 + 3;
  });

  y += 14;

  // 6. Actionable AI Recommendations for Upcoming Week
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text('Strategic Action Plan for Next Week', margin, y);
  y += 14;

  data.recommendations.forEach((rec, idx) => {
    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...accentColor);
    doc.text(`Action #${idx + 1}:`, margin + 10, y + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    const recText = doc.splitTextToSize(rec, contentWidth - 75);
    doc.text(recText, margin + 65, y + 16);

    y += 32;
  });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text(
    'Generated by OmniPost AI • Cross-Platform Social Studio • Confidential Internal Report',
    margin,
    pageHeight - 20
  );
  doc.text(`Page 1 of 1`, pageWidth - margin - 45, pageHeight - 20);

  // Save the PDF
  doc.save(`OmniPost_Weekly_Report_${new Date().toISOString().split('T')[0]}.pdf`);
}
