// 1. Updated fetchCourses
const fetchCourses = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/courses`);
    if (res.ok) {
      const responseData = await res.json();
      // Safely extract data array whether backend returns [...] or { success: true, data: [...] }
      const coursesList = Array.isArray(responseData) ? responseData : (responseData.data || []);
      setPublishedCourses(coursesList);
    }
  } catch (e) {
    console.error('Fetch courses error:', e);
  }
};

// 2. Updated handleSubmit
const handlePublishCourse = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMsg({ type: '', text: '' });

  const fullCoursePackage = {
    ...courseData,
    lessons,
    quiz: quizQuestions
  };

  try {
    const res = await fetch(`${API_BASE}/api/courses`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fullCoursePackage),
    });

    const data = await res.json();

    if (res.ok && (data.success !== false)) {
      setMsg({ type: 'success', text: '🚀 Course track published into database successfully!' });
      setCourseData({ title: '', category: 'Music Videos & Demo Tracks', description: '', thumbnail: '' });
      fetchCourses(); // Reload list
    } else {
      setMsg({ type: 'error', text: data.message || 'Error publishing course.' });
    }
  } catch (err) {
    console.error('Submit Error:', err);
    setMsg({ type: 'error', text: 'Failed to complete publish request. Check console (F12) for details.' });
  } finally {
    setLoading(false);
  }
};