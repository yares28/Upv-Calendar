import { Component, OnInit, Renderer2, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service';

interface Exam {
  id: number;
  name: string;
  date: Date;
  time: string;
  location: string;
  course: string;
  subject: string;
  semester: string;
  notes?: string;
}

interface SavedCalendar {
  id: number;
  userId: number;
  name: string;
  filters: {
    degrees: string[];
    semesters: string[];
    subjects: string[];
  };
}

interface User {
  id: number;
  email: string;
  password: string; // In real-world app, never store plaintext passwords
  name: string;
  savedCalendars: SavedCalendar[];
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  // Calendar data
  months: any[] = [];
  filteredMonths: any[] = [];
  currentYear: number = 2025;
  selectedDate: Date | null = null;
  
  // Exam data
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  // New property to store filtered exams for display without affecting calendar
  displayExams: Exam[] = [];
  
  // Filter options
  degrees: string[] = ['Computer Science', 'Engineering', 'Mathematics'];
  semesters: string[] = ['A', 'B'];
  subjects: string[] = ['Programming', 'Mathematics', 'Physics', 'Databases', 'Networks', 'Software Engineering'];
  
  // Multi-select filter arrays
  selectedDegrees: string[] = [];
  selectedSemesters: string[] = [];
  selectedSubjects: string[] = [];
  
  // Old single select variables - keeping for compatibility
  selectedDegree: string = '';
  selectedSemester: string = '';
  selectedSubject: string = '';

  // Dropdown control
  openDropdowns = {
    degree: false,
    semester: false,
    subject: false
  };
  
  // Popup control
  showPopup: boolean = false;
  popupPosition: { top: string; left: string; transformOrigin?: string } = { top: '0px', left: '0px' };

  // Auth modal control
  showAuthModal: boolean = false;
  authMode: 'login' | 'register' = 'login';
  authForm = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  isLoggedIn: boolean = false;
  currentUser: User | null = null;

  // Calendar saving
  savedCalendars: SavedCalendar[] = [];

  // Notification toast
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  notificationTimeout: any;

  // Color theme variables
  themeColors = {
    text: '#111511',
    background: '#f7f8f7',
    primary: '#758f76',
    secondary: '#b5c3c4',
    accent: '#96a0aa'
  };

  // Theme mode
  isDarkMode: boolean = false;
  private isBrowser: boolean;

  // Mock users for demonstration (in a real app, this would be in a backend database)
  private users: User[] = [
    { id: 1, email: 'demo@example.com', password: 'password123', name: 'John Doe', savedCalendars: [] }
  ];

  // Export section toggle
  showExportOptions: boolean = false;

  constructor(
    private renderer: Renderer2, 
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Mock exam data with exams in different months
    this.exams = [
      { id: 1, name: 'Programming Fundamentals', date: new Date(2025, 8, 15), time: '10:00', location: 'Room A1', course: 'Computer Science', subject: 'Programming', semester: 'A', notes: 'First exam of the semester' },
      { id: 2, name: 'Calculus', date: new Date(2025, 8, 20), time: '15:00', location: 'Room B2', course: 'Mathematics', subject: 'Mathematics', semester: 'A', notes: 'Standard calculus exam' },
      { id: 3, name: 'Physics I', date: new Date(2025, 9, 5), time: '9:00', location: 'Room C3', course: 'Engineering', subject: 'Physics', semester: 'A', notes: 'Introductory physics exam' },
      { id: 4, name: 'Data Structures', date: new Date(2025, 10, 15), time: '11:00', location: 'Room A2', course: 'Computer Science', subject: 'Programming', semester: 'B', notes: 'Advanced programming concepts' },
      { id: 5, name: 'Databases', date: new Date(2026, 1, 10), time: '16:00', location: 'Room A3', course: 'Computer Science', subject: 'Databases', semester: 'A', notes: 'Database management fundamentals' },
      { id: 6, name: 'Computer Networks', date: new Date(2026, 3, 5), time: '12:00', location: 'Room D1', course: 'Computer Science', subject: 'Networks', semester: 'B', notes: 'Network architecture and protocols' },
      { id: 7, name: 'Software Engineering', date: new Date(2026, 5, 20), time: '11:00', location: 'Room D2', course: 'Computer Science', subject: 'Software Engineering', semester: 'B', notes: 'Project management and team collaboration' }
    ];
    
    // Mock saved calendars
    this.savedCalendars = [
      {
        id: 1,
        userId: 1,
        name: 'CS Exams Only',
        filters: {
          degrees: ['Computer Science'],
          semesters: ['A', 'B'],
          subjects: ['Programming', 'Databases']
        }
      }
    ];
  }

  ngOnInit(): void {
    this.generateCalendars();
    this.filterExams();
    this.filterMonths();
    
    // Only access browser APIs if running in browser
    if (this.isBrowser) {
      // Check for stored login
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
          this.isLoggedIn = true;
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
      
      // Check for stored theme preference
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        this.isDarkMode = true;
        this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
      }
    }
    
    // Subscribe to theme changes
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  // Toggle dropdown menus
  toggleDropdown(dropdownName: 'degree' | 'semester' | 'subject'): void {
    // Close all other dropdowns
    for (const key in this.openDropdowns) {
      if (key !== dropdownName) {
        this.openDropdowns[key as keyof typeof this.openDropdowns] = false;
      }
    }
    
    // Toggle the selected dropdown
    this.openDropdowns[dropdownName] = !this.openDropdowns[dropdownName];
  }

  // Multi-select checkbox utilities
  isSelected(item: string, selectedArray: string[]): boolean {
    return selectedArray.indexOf(item) >= 0;
  }

  toggleSelection(item: string, selectedArray: string[]): void {
    const index = selectedArray.indexOf(item);
    if (index >= 0) {
      selectedArray.splice(index, 1); // Remove if already selected
    } else {
      selectedArray.push(item); // Add if not selected
    }
    this.updateFilters();
  }

  // Generate calendar data for all months
  generateCalendars(): void {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Initialize empty months array
    this.months = [];
    
    // Generate for Sep 2025 to Aug 2026
    for (let month = 8; month < 12; month++) {
      this.months.push(this.generateMonthData(2025, month, monthNames[month]));
    }
    
    for (let month = 0; month < 8; month++) {
      this.months.push(this.generateMonthData(2026, month, monthNames[month]));
    }
  }

  // Generate data for a specific month
  generateMonthData(year: number, month: number, monthName: string): any {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adjust starting day for Monday as first day (0 = Monday, 6 = Sunday)
    let startingDay = firstDay.getDay() - 1; // Subtract 1 to make Monday (1) become 0
    if (startingDay < 0) startingDay = 6; // If it was Sunday (0), make it 6 for the end of the week
    
    // Create weeks array
    let days = [];
    let week = Array(7).fill(null);
    let hasAnyExam = false;
    
    // Fill in empty days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      week[i] = null;
    }
    
    // Fill in days of the month
    let dayCount = 1;
    for (let i = startingDay; i < 7; i++) {
      const hasExams = this.checkExamForDate(new Date(year, month, dayCount));
      if (hasExams) {
        hasAnyExam = true;
      }
      
      week[i] = {
        day: dayCount,
        date: new Date(year, month, dayCount),
        hasExams: hasExams
      };
      dayCount++;
    }
    days.push(week);
    
    // Fill in remaining weeks
    while (dayCount <= daysInMonth) {
      week = Array(7).fill(null);
      for (let i = 0; i < 7 && dayCount <= daysInMonth; i++) {
        const hasExams = this.checkExamForDate(new Date(year, month, dayCount));
        if (hasExams) {
          hasAnyExam = true;
        }
        
        week[i] = {
          day: dayCount,
          date: new Date(year, month, dayCount),
          hasExams: hasExams
        };
        dayCount++;
      }
      days.push(week);
    }
    
    return {
      year: year,
      month: month,
      monthName: monthName,
      days: days,
      hasExams: hasAnyExam
    };
  }

  // Filter months to only show those with exams
  filterMonths(): void {
    this.filteredMonths = this.months.filter(month => month.hasExams);
  }

  // Check if there are exams on a specific date
  checkExamForDate(date: Date): boolean {
    return this.filteredExams.some(exam => 
      exam.date.getFullYear() === date.getFullYear() &&
      exam.date.getMonth() === date.getMonth() &&
      exam.date.getDate() === date.getDate()
    );
  }

  // Select a date to view exams (only if it has exams)
  selectDate(day: any, event: MouseEvent): void {
    if (!day || !day.hasExams) {
      return; // Do nothing if the day has no exams
    }
    
    this.selectedDate = day.date;
    // Update only the exams to display in the popup without affecting the calendar
    this.getDisplayExams();
    
    // Position and show popup
    this.positionPopup(event);
  }
  
  // Position popup near the clicked date
  positionPopup(event: MouseEvent): void {
    // Calculate popup position based on event coordinates
    const x = event.clientX;
    const y = event.clientY;
    
    // Adjust position to make sure it stays in viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = 350; // Approximate popup width
    const popupHeight = 400; // Approximate popup height
    
    let left = x + 20;
    let top = y - 10;
    
    // Check if popup would go off the right edge
    if (left + popupWidth > viewportWidth) {
      left = x - popupWidth - 20;
    }
    
    // Check if popup would go off the bottom edge
    if (top + popupHeight > viewportHeight) {
      top = viewportHeight - popupHeight - 10;
    }
    
    // Ensure we don't go off the left or top edge
    left = Math.max(10, left);
    top = Math.max(10, top);
    
    // Set transform-origin based on where the popup is relative to the click
    let originX = left > x ? 'right' : 'left';
    let originY = top > y ? 'bottom' : 'top';
    
    this.popupPosition = {
      left: `${left}px`,
      top: `${top}px`,
      transformOrigin: `${originX} ${originY}`
    };
    
    this.showPopup = true;
    
    // Find the popup element and set the transform-origin 
    setTimeout(() => {
      const popupElement = document.querySelector('.exam-popup') as HTMLElement;
      if (popupElement) {
        popupElement.style.transformOrigin = `${originX} ${originY}`;
      }
    }, 0);
  }
  
  // Close popup
  closePopup(): void {
    this.showPopup = false;
  }

  // Clear selected date
  clearSelectedDate(): void {
    this.selectedDate = null;
    this.getDisplayExams();
    this.showPopup = false;
  }

  // Apply filters to exams for calendar view
  filterExams(): void {
    this.filteredExams = this.exams.filter(exam => {
      // Filter by degree (multi-select)
      if (this.selectedDegrees.length > 0 && !this.selectedDegrees.includes(exam.course)) {
        return false;
      }
      
      // Filter by semester (multi-select)
      if (this.selectedSemesters.length > 0 && !this.selectedSemesters.includes(exam.semester)) {
        return false;
      }
      
      // Filter by subject (multi-select)
      if (this.selectedSubjects.length > 0 && !this.selectedSubjects.includes(exam.subject)) {
        return false;
      }
      
      return true;
    });
    
    // After filtering exams, regenerate calendar data and filter months
    this.generateCalendars();
    this.filterMonths();
    
    // Also update the display exams
    this.getDisplayExams();
  }

  // Get exams to display in the popup
  getDisplayExams(): void {
    // Start with the filtered exams based on filters
    this.displayExams = this.filteredExams.filter(exam => {
      // If a date is selected, only show exams on that date
      if (this.selectedDate) {
        return exam.date.getFullYear() === this.selectedDate.getFullYear() &&
               exam.date.getMonth() === this.selectedDate.getMonth() &&
               exam.date.getDate() === this.selectedDate.getDate();
      }
      
      return true;
    });
  }

  // Update filters
  updateFilters(): void {
    this.filterExams();
  }
  
  // Handle document click to close popup when clicking outside
  handleDocumentClick(event: MouseEvent): void {
    // Check if click is outside the popup
    const popupElement = document.querySelector('.exam-popup');
    if (popupElement && !popupElement.contains(event.target as Node) && 
        !(event.target as Element).classList.contains('calendar-date')) {
      this.closePopup();
    }
    
    // Close dropdowns when clicking outside
    const isClickInsideDropdown = 
      (event.target as Element).closest('.dropdown-filter') !== null;
    
    if (!isClickInsideDropdown) {
      // Close all dropdowns
      for (const key in this.openDropdowns) {
        this.openDropdowns[key as keyof typeof this.openDropdowns] = false;
      }
    }
  }

  // Authentication Methods
  openAuthModal(): void {
    if (this.isLoggedIn) {
      // Show user account information if logged in
      // For demo purpose, we'll just log out
      this.logout();
      return;
    }
    
    this.authMode = 'login';
    this.authForm = {
      email: '',
      password: '',
      confirmPassword: ''
    };
    this.showAuthModal = true;
  }
  
  closeAuthModal(event: MouseEvent): void {
    // Only close if clicking on the overlay or close button
    if (
      (event.target as Element).classList.contains('modal-overlay') ||
      (event.target as Element).classList.contains('close-modal-btn')
    ) {
      this.showAuthModal = false;
    }
  }
  
  toggleAuthMode(event: MouseEvent): void {
    event.preventDefault();
    this.authMode = this.authMode === 'login' ? 'register' : 'login';
  }
  
  submitAuthForm(): void {
    if (this.authMode === 'login') {
      this.login();
    } else {
      this.register();
    }
  }
  
  login(): void {
    const { email, password } = this.authForm;
    
    // Simple validation
    if (!email || !password) {
      this.showToast('Please enter both email and password.', 'error');
      return;
    }
    
    // Find user
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser = user;
      this.isLoggedIn = true;
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.showAuthModal = false;
      this.showToast('Successfully logged in!', 'success');
    } else {
      this.showToast('Invalid email or password.', 'error');
    }
  }
  
  register(): void {
    const { email, password, confirmPassword } = this.authForm;
    
    // Simple validation
    if (!email || !password) {
      this.showToast('Please enter email and password.', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      this.showToast('Passwords do not match.', 'error');
      return;
    }
    
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      this.showToast('Email already in use.', 'error');
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: this.users.length + 1,
      email,
      password,
      name: email.split('@')[0],
      savedCalendars: []
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    this.isLoggedIn = true;
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    }
    this.showAuthModal = false;
    this.showToast('Account created successfully!', 'success');
  }
  
  logout(): void {
    this.currentUser = null;
    this.isLoggedIn = false;
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.showToast('You have been logged out.', 'success');
  }

  // Show notification toast
  showToast(message: string, type: 'success' | 'error'): void {
    // Clear any existing timeout
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    
    // Set message and show
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    
    // Hide after 3 seconds
    this.notificationTimeout = setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  // Toggle between light and dark theme
  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  // Methods for export functionality
  exportToGoogleCalendar() {
    if (this.filteredExams.length === 0) {
      alert('No exams to export. Please adjust your filters.');
      return;
    }

    // Confirm if exporting many exams
    if (this.filteredExams.length > 5) {
      if (!confirm(`You are about to open ${this.filteredExams.length} tabs for Google Calendar. Continue?`)) {
        return;
      }
    }

    let exportCount = 0;
    
    // Open tabs with staggered timing to prevent browser blocking
    this.filteredExams.forEach((exam, index) => {
      setTimeout(() => {
        const startDate = new Date(exam.date);
        // Set exam time (default to 9:00 AM if not specified)
        const [hours, minutes] = exam.time ? exam.time.split(':') : ['09', '00'];
        startDate.setHours(parseInt(hours), parseInt(minutes), 0);
        
        // End time (default to 2 hours after start)
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);
        
        // Format dates for Google Calendar
        const startDateFormatted = this.formatDateForGoogleCalendar(startDate);
        const endDateFormatted = this.formatDateForGoogleCalendar(endDate);
        
        // Create detailed description with exam info
        const description = `Subject: ${exam.subject}\nDegree: ${exam.course}\nSemester: ${exam.semester}\nLocation: ${exam.location || 'TBD'}\nNotes: ${exam.notes || ''}`;
        
        // Build Google Calendar URL
        const url = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent('Exam: ' + exam.subject)}&dates=${startDateFormatted}/${endDateFormatted}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(exam.location || '')}&sf=true`;
        
        window.open(url, '_blank');
        exportCount++;
      }, index * 300); // Stagger opening of tabs by 300ms each
    });

    // Show success message
    setTimeout(() => {
      alert(`Exported ${exportCount} exams to Google Calendar.`);
    }, this.filteredExams.length * 300 + 100);
  }

  // Format date for Google Calendar URL (YYYYMMDDTHHMMSS format)
  private formatDateForGoogleCalendar(date: Date): string {
    return date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') + 
      'T' + 
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      date.getSeconds().toString().padStart(2, '0');
  }

  // Export to iCal format following RFC 5545 standards
  exportToIcal() {
    if (this.filteredExams.length === 0) {
      alert('No exams to export. Please adjust your filters.');
      return;
    }

    try {
      // Calendar header
      let icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//UPV//Exam Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:UPV Exams',
        'X-WR-TIMEZONE:Europe/Madrid',
      ].join('\r\n');

      // Add each exam event
      this.filteredExams.forEach(exam => {
        const startDate = new Date(exam.date);
        
        // Set exam time (default to 9:00 AM if not specified)
        const [hours, minutes] = exam.time ? exam.time.split(':') : ['09', '00'];
        startDate.setHours(parseInt(hours), parseInt(minutes), 0);
        
        // End time (default to 2 hours after start)
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);
        
        // Create a unique ID for the event
        const uid = `exam-${exam.subject.replace(/\s+/g, '-')}-${startDate.getTime()}@upv.es`;
        
        // Format dates for iCal (YYYYMMDDTHHMMSSZ format)
        const dtStart = this.formatDateForIcal(startDate);
        const dtEnd = this.formatDateForIcal(endDate);
        const dtStamp = this.formatDateForIcal(new Date());
        
        // Create detailed description with exam info
        let description = `Subject: ${exam.subject}\\nDegree: ${exam.course}\\nSemester: ${exam.semester}`;
        if (exam.location) description += `\\nLocation: ${exam.location}`;
        if (exam.notes) description += `\\nNotes: ${exam.notes}`;
        
        // Add event to calendar with line folding for long text
        icalContent += '\r\n' + [
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `DTSTAMP:${dtStamp}`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          `SUMMARY:${this.foldLine('Exam: ' + exam.subject)}`,
          `DESCRIPTION:${this.foldLine(description)}`,
          'CATEGORIES:EXAM,UNIVERSITY',
          exam.location ? `LOCATION:${this.foldLine(exam.location)}` : '',
          // Add alarms (1 day and 1 hour before)
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          'DESCRIPTION:Exam reminder - 1 day',
          'TRIGGER:-P1D',
          'END:VALARM',
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          'DESCRIPTION:Exam reminder - 1 hour',
          'TRIGGER:-PT1H',
          'END:VALARM',
          'END:VEVENT'
        ].filter(line => line).join('\r\n'); // Filter out empty lines
      });

      // Calendar footer
      icalContent += '\r\nEND:VCALENDAR';

      // Create and download file
      const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'upv_exams.ics';
      link.click();
      
      // Success message
      alert(`Successfully exported ${this.filteredExams.length} exams to iCal format.`);
    } catch (error) {
      console.error('Error exporting to iCal:', error);
      alert('Failed to export calendar. Please try again later.');
    }
  }

  // Format date for iCal (YYYYMMDDTHHMMSSZ format)
  private formatDateForIcal(date: Date): string {
    return date.getUTCFullYear().toString() +
      (date.getUTCMonth() + 1).toString().padStart(2, '0') +
      date.getUTCDate().toString().padStart(2, '0') + 
      'T' + 
      date.getUTCHours().toString().padStart(2, '0') +
      date.getUTCMinutes().toString().padStart(2, '0') +
      date.getUTCSeconds().toString().padStart(2, '0') +
      'Z';
  }

  // Implement line folding for iCal (RFC 5545 section 3.1)
  private foldLine(text: string): string {
    if (!text) return '';
    
    // Escape special characters
    text = text.replace(/[\\;,]/g, match => '\\' + match);
    
    // Implement line folding (max 75 chars per line)
    let result = '';
    while (text.length > 0) {
      if (result.length > 0) {
        result += '\r\n '; // Folded lines start with a space
      }
      result += text.slice(0, 75);
      text = text.slice(75);
    }
    return result;
  }

  // Save the current calendar configuration
  saveCalendar(): void {
    if (!this.isLoggedIn) {
      this.showToast('Please log in to save your calendar.', 'error');
      this.openAuthModal();
      return;
    }
    
    // Prompt for calendar name
    const calendarName = prompt('Enter a name for this calendar:', 'My Calendar');
    if (!calendarName) return; // User cancelled
    
    // Create a new saved calendar
    const newCalendar: SavedCalendar = {
      id: Date.now(), // Use timestamp as temporary ID
      userId: this.currentUser!.id,
      name: calendarName,
      filters: {
        degrees: [...this.selectedDegrees],
        semesters: [...this.selectedSemesters],
        subjects: [...this.selectedSubjects]
      }
    };
    
    // Add to user's saved calendars
    if (this.currentUser) {
      this.currentUser.savedCalendars.push(newCalendar);
      // Update localStorage if in browser
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
      this.showToast(`Calendar "${calendarName}" saved successfully!`, 'success');
    }
  }
  
  // Export to Google Calendar
  exportToGoogle(): void {
    // Alias for exportToGoogleCalendar for HTML compatibility
    this.exportToGoogleCalendar();
  }
  
  // Export to iCal format
  exportToICal(): void {
    // Alias for exportToIcal for HTML compatibility
    this.exportToIcal();
  }
  
  // Open the user's saved calendars
  openMyCalendar(): void {
    if (!this.isLoggedIn) {
      this.showToast('Please log in to view your saved calendars.', 'error');
      this.openAuthModal();
      return;
    }
    
    if (!this.currentUser || this.currentUser.savedCalendars.length === 0) {
      this.showToast('You have no saved calendars. Create one first!', 'error');
      return;
    }
    
    // Show a list of saved calendars
    const calendarList = this.currentUser.savedCalendars.map(
      (cal, index) => `${index + 1}. ${cal.name}`
    ).join('\n');
    
    const selection = prompt(`Select a calendar to load (enter number):\n${calendarList}`);
    if (!selection) return; // User cancelled
    
    const index = parseInt(selection) - 1;
    if (isNaN(index) || index < 0 || index >= this.currentUser.savedCalendars.length) {
      this.showToast('Invalid selection. Please try again.', 'error');
      return;
    }
    
    // Load the selected calendar
    const calendar = this.currentUser.savedCalendars[index];
    this.selectedDegrees = [...calendar.filters.degrees];
    this.selectedSemesters = [...calendar.filters.semesters];
    this.selectedSubjects = [...calendar.filters.subjects];
    
    // Update filters
    this.updateFilters();
    this.showToast(`Calendar "${calendar.name}" loaded successfully!`, 'success');
  }

  // Toggle export options visibility
  toggleExportSection(): void {
    this.showExportOptions = !this.showExportOptions;
  }
}
