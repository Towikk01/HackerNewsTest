import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const fetchTopStoryIds = createAsyncThunk('stories/fetchTopStoryIds', async () => {
  try {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top story IDs:', error);
    throw error;
  }
});

const fetchStoryDetails = createAsyncThunk('stories/fetchStoryDetails', async (storyId) => {
  try {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching story details for ID ${storyId}:`, error);
    throw error;
  }
});

const fetchCommentsByStoryId = createAsyncThunk('stories/fetchCommentsByStoryId', async (storyId) => {
  try {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const story = await response.json();
    if (story.kids) {
      const commentPromises = story.kids.map((commentId) => {
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`)
          .then((response) => response.json());
      });
      const comments = await Promise.all(commentPromises);
      return comments;
    }

    return [];
  } catch (error) {
    console.error(`Error fetching comments for story ID ${storyId}:`, error);
    throw error;
  }
});


const fetchSubcommentsByCommentId = createAsyncThunk('stories/fetchSubcommentsByCommentId', async (commentId) => {
  try {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const comment = await response.json();
    if (comment.kids) {
      const commentPromises = comment.kids.map((subcommentId) => {
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${subcommentId}.json`)
          .then((response) => response.json());
      });
      const subcomments = await Promise.all(commentPromises);
      return subcomments;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching subcomments for comment ID ${commentId}:`, error);
    throw error;
  }
});



const storySlice = createSlice({
  name: 'stories',
  initialState: {
    topStoryIds: [],
    stories: [],
    comments: [],
    subcomments: {},
    subcommentsLoading: false,
  },
  reducers: {
    clearStories: (state, action) => {
      state.stories = []
    },
    clearComments: (state, action) => {
      state.comments = []
    },
    clearSubcommentsByCommentId: (state, action) => {
      state.subcomments[action.payload] = []
    },
    clearSubcomments: (state, action) => {
      state.subcomments = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopStoryIds.fulfilled, (state, action) => {
        state.topStoryIds = action.payload;
      })
      .addCase(fetchStoryDetails.fulfilled, (state, action) => {
        state.stories.push(action.payload);
      }).addCase(fetchCommentsByStoryId.fulfilled, (state, action) => {
        state.comments = action.payload
      }).addCase(fetchSubcommentsByCommentId.fulfilled, (state, action) => {
        action.payload.forEach(subcomment => {
          if (state.subcomments[subcomment.parent]) {
            state.subcomments[subcomment.parent].push(subcomment)
          } else {
            state.subcomments[subcomment.parent] = [subcomment,]
          }
        }
        )
        state.subcommentsLoading = false;
      }).addCase(fetchSubcommentsByCommentId.pending, (state, action) => {
        state.subcommentsLoading = true;
      }).addCase(fetchSubcommentsByCommentId.rejected, (state, action) => {
        state.subcommentsLoading = false
      })
  },
});

export { fetchTopStoryIds, fetchStoryDetails, fetchCommentsByStoryId, fetchSubcommentsByCommentId };

export const { clearStories, clearComments, clearSubcommentsByCommentId, clearSubcomments } = storySlice.actions

export const selectTopStoriesIds = state => state.topStoryIds;
export const selectStories = state => state.stories;
export const selectComments = state => state.comments;
export const selectSubcomments = state => state.subcomments;
export const selectSubcommentsLoading = state => state.subcommentsLoading;


export default storySlice.reducer;
