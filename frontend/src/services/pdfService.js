// frontend/src/services/pdfService.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFReportService {
  generateEmergencyReport(emergency, routeTracking = []) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colors
    const primaryColor = [26, 82, 118]; // #1A5276
    const accentColor = [102, 126, 234]; // #667eea
    const dangerColor = [220, 53, 69]; // Critical
    const warningColor = [253, 126, 20]; // High
    const infoColor = [255, 193, 7]; // Medium
    const successColor = [40, 167, 69]; // Low

    // Get severity color
    const getSeverityColor = (severity) => {
      switch (severity?.toLowerCase()) {
        case 'critical': return dangerColor;
        case 'high': return warningColor;
        case 'medium': return infoColor;
        case 'low': return successColor;
        default: return [108, 117, 125];
      }
    };

    // Header with Logo Area
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('🚑 SMART AMBULANCE SYSTEM', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Emergency Response Report', pageWidth / 2, 27, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Report ID: EMG-${emergency.id}-${Date.now()}`, pageWidth / 2, 35, { align: 'center' });

    let yPos = 50;

    // Emergency ID Badge
    doc.setFillColor(...accentColor);
    doc.roundedRect(15, yPos, 60, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Emergency #${emergency.id}`, 45, yPos + 8, { align: 'center' });

    // Severity Badge
    const severityColor = getSeverityColor(emergency.severity);
    doc.setFillColor(...severityColor);
    doc.roundedRect(pageWidth - 75, yPos, 60, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text((emergency.severity || 'N/A').toUpperCase(), pageWidth - 45, yPos + 8, { align: 'center' });

    yPos += 25;

    // Patient Information Section
    doc.setFillColor(235, 245, 251);
    doc.roundedRect(15, yPos, pageWidth - 30, 45, 5, 5, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT INFORMATION', 20, yPos + 8);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const patientInfo = [
      ['Name:', emergency.patient_name || 'N/A'],
      ['Age:', `${emergency.patient_age || 'N/A'} years`],
      ['Gender:', (emergency.patient_gender || 'N/A').toUpperCase()],
      ['Contact:', emergency.patient_phone || 'N/A']
    ];
    
    let infoY = yPos + 18;
    patientInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 25, infoY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, infoY);
      infoY += 8;
    });

    yPos += 55;

    // Emergency Details Section
    doc.setFillColor(253, 242, 233);
    doc.roundedRect(15, yPos, pageWidth - 30, 55, 5, 5, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EMERGENCY DETAILS', 20, yPos + 8);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const emergencyDetails = [
      ['Type:', emergency.emergency_type || 'N/A'],
      ['Severity:', (emergency.severity || 'N/A').toUpperCase()],
      ['Status:', (emergency.status || 'N/A').replace('_', ' ').toUpperCase()],
      ['Location:', emergency.pickup_address || 'N/A']
    ];
    
    infoY = yPos + 18;
    emergencyDetails.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 25, infoY);
      doc.setFont('helvetica', 'normal');
      
      // Wrap long text
      const maxWidth = pageWidth - 75;
      const lines = doc.splitTextToSize(value, maxWidth);
      doc.text(lines, 60, infoY);
      infoY += lines.length * 6 + 2;
    });

    yPos += 65;

    // Description
    if (emergency.description) {
      doc.setFillColor(255, 243, 205);
      const descHeight = Math.max(25, Math.ceil(emergency.description.length / 80) * 6 + 15);
      doc.roundedRect(15, yPos, pageWidth - 30, descHeight, 5, 5, 'F');
      
      doc.setTextColor(...primaryColor);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Description:', 20, yPos + 8);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(emergency.description, pageWidth - 50);
      doc.text(descLines, 20, yPos + 16);
      
      yPos += descHeight + 10;
    }

    // Response Team Section
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(232, 245, 233);
    doc.roundedRect(15, yPos, (pageWidth - 35) / 2, 45, 5, 5, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('🚑 AMBULANCE', 20, yPos + 8);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (emergency.ambulance_details) {
      const ambulanceInfo = [
        ['Vehicle:', emergency.ambulance_details.vehicle_number || 'N/A'],
        ['Type:', (emergency.ambulance_details.ambulance_type || 'N/A').replace('_', ' ')],
        ['Driver:', emergency.ambulance_details.driver_name || 'N/A'],
        ['Contact:', emergency.ambulance_details.driver_phone || 'N/A']
      ];
      
      infoY = yPos + 16;
      ambulanceInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, infoY);
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(value, 50);
        doc.text(valueLines, 42, infoY);
        infoY += 7;
      });
    } else {
      doc.text('Not yet assigned', 20, yPos + 20);
    }

    // Hospital Section
    doc.setFillColor(232, 245, 233);
    doc.roundedRect((pageWidth / 2) + 2.5, yPos, (pageWidth - 35) / 2, 45, 5, 5, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('🏥 HOSPITAL', (pageWidth / 2) + 7.5, yPos + 8);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (emergency.hospital_details) {
      const hospitalInfo = [
        ['Name:', emergency.hospital_details.name || 'N/A'],
        ['Phone:', emergency.hospital_details.phone || 'N/A'],
        ['Beds:', `${emergency.hospital_details.emergency_beds_available || 0} available`]
      ];
      
      infoY = yPos + 16;
      hospitalInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, (pageWidth / 2) + 7.5, infoY);
        doc.setFont('helvetica', 'normal');
        const valueLines = doc.splitTextToSize(value, 50);
        doc.text(valueLines, (pageWidth / 2) + 27, infoY);
        infoY += 7;
      });
    } else {
      doc.text('Not yet assigned', (pageWidth / 2) + 7.5, yPos + 20);
    }

    yPos += 55;

    // Timeline Section
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(15, yPos, pageWidth - 30, 60, 5, 5, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('📅 TIMELINE', 20, yPos + 8);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const timeline = [
      ['Emergency Created:', this.formatDateTime(emergency.created_at)],
      ['Journey Started:', this.formatDateTime(emergency.updated_at)],
      ['Ambulance Arrived:', emergency.actual_arrival_time ? this.formatDateTime(emergency.actual_arrival_time) : 'In Progress'],
      ['Status:', (emergency.status || '').replace('_', ' ').toUpperCase()]
    ];
    
    infoY = yPos + 18;
    timeline.forEach(([label, value]) => {
      // Timeline dot
      doc.setFillColor(...accentColor);
      doc.circle(22, infoY - 2, 1.5, 'F');
      
      // Timeline line (except last)
      if (infoY < yPos + 48) {
        doc.setDrawColor(...accentColor);
        doc.setLineWidth(0.5);
        doc.line(22, infoY, 22, infoY + 8);
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(label, 28, infoY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 75, infoY);
      infoY += 10;
    });

    // Calculate response time if available
    if (emergency.created_at && emergency.actual_arrival_time) {
      const createdTime = new Date(emergency.created_at);
      const arrivedTime = new Date(emergency.actual_arrival_time);
      const diffMinutes = Math.round((arrivedTime - createdTime) / 60000);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Total Response Time:', 28, infoY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...successColor);
      doc.text(`${diffMinutes} minutes`, 75, infoY);
      doc.setTextColor(0, 0, 0);
    }

    yPos += 70;

    // Route Tracking Table (if available)
    if (routeTracking && routeTracking.length > 0) {
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(...primaryColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('🗺️ ROUTE TRACKING HISTORY', 15, yPos);
      
      yPos += 5;

      const trackingData = routeTracking.slice(0, 10).map((track, index) => [
        index + 1,
        parseFloat(track.current_latitude).toFixed(4),
        parseFloat(track.current_longitude).toFixed(4),
        `${parseFloat(track.distance_remaining).toFixed(2)} km`,
        `${track.estimated_time} min`,
        `${track.current_speed} km/h`,
        new Date(track.timestamp).toLocaleTimeString()
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['#', 'Latitude', 'Longitude', 'Distance', 'ETA', 'Speed', 'Time']],
        body: trackingData,
        theme: 'grid',
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [0, 0, 0]
        },
        alternateRowStyles: {
          fillColor: [245, 245, 250]
        },
        margin: { left: 15, right: 15 }
      });

      yPos = doc.lastAutoTable.finalY + 10;
    }

    // Footer Section
    const footerY = pageHeight - 40;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);
    
    // Signature boxes
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    
    doc.text('Ambulance Driver', 25, footerY + 8);
    doc.text('Hospital Staff', (pageWidth / 2) - 10, footerY + 8);
    doc.text('Supervisor', pageWidth - 45, footerY + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.line(20, footerY + 20, 70, footerY + 20);
    doc.line((pageWidth / 2) - 25, footerY + 20, (pageWidth / 2) + 25, footerY + 20);
    doc.line(pageWidth - 70, footerY + 20, pageWidth - 20, footerY + 20);
    
    doc.setFontSize(8);
    doc.text('Signature', 45, footerY + 24, { align: 'center' });
    doc.text('Signature', pageWidth / 2, footerY + 24, { align: 'center' });
    doc.text('Signature', pageWidth - 45, footerY + 24, { align: 'center' });

    // Report metadata at bottom
    doc.setFontSize(7);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('Smart Ambulance System | Emergency Response Report', pageWidth / 2, pageHeight - 5, { align: 'center' });

    // Save PDF
    const fileName = `Emergency_Report_${emergency.id}_${Date.now()}.pdf`;
    doc.save(fileName);
    
    return fileName;
  }

  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}

export default new PDFReportService();
