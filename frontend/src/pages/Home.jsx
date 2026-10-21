useEffect(() => {
    // ሁለቱንም ስቶሬጆች በማቀናጀት መረጃውን አንድ እናደርጋለን
    const storedEqubs = localStorage.getItem('yop_saved_equbs');
    const allEqubs = localStorage.getItem('all_equbs');
    
    let combined = [];
    if (storedEqubs) {
      try { combined = JSON.parse(storedEqubs); } catch (e) {}
    }
    if (allEqubs) {
      try {
        const parsedAll = JSON.parse(allEqubs);
        const ids = new Set(combined.map(item => item.id));
        parsedAll.forEach(item => {
          if (!ids.has(item.id)) {
            combined.push(item);
          }
        });
      } catch (e) {}
    }

    setSavedEqubs(combined);
    // መረጃው በሁለቱም ಕይ እንዲመሳሰል እናደርጋለን
    localStorage.setItem('yop_saved_equbs', JSON.stringify(combined));
    localStorage.setItem('all_equbs', JSON.stringify(combined));
  }, []);