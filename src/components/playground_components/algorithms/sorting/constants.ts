export const algorithmCodeSnippets: Record<string, string> = {
    "bubble-sort": `def bubble_sort(arr):
      n = len(arr)
      for i in range(n):
          for j in range(0, n - i - 1):
              # Compare adjacent elements
              if arr[j] > arr[j + 1]:
                  # Swap if needed
                  arr[j], arr[j + 1] = arr[j + 1], arr[j]
      return arr`,
    "selection-sort": `def selection_sort(arr):
      n = len(arr)
      for i in range(n):
          # Find the minimum element in remaining unsorted array
          min_idx = i
          for j in range(i + 1, n):
              if arr[j] < arr[min_idx]:
                  min_idx = j
          # Swap the found minimum element with the first element
          arr[i], arr[min_idx] = arr[min_idx], arr[i]
      return arr`,
    "insertion-sort": `def insertion_sort(arr):
      for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          # Move elements greater than key one position ahead
          while j >= 0 and arr[j] > key:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = key
      return arr`,
    "merge-sort": `def merge_sort(arr):
      if len(arr) > 1:
          # Finding the mid of the array
          mid = len(arr) // 2
          # Dividing the array elements into 2 halves
          L = arr[:mid]
          R = arr[mid:]
          # Sorting the first half
          merge_sort(L)
          # Sorting the second half
          merge_sort(R)
          i = j = k = 0
          # Copy data to temp arrays L[] and R[]
          while i < len(L) and j < len(R):
              if L[i] <= R[j]:
                  arr[k] = L[i]
                  i += 1
              else:
                  arr[k] = R[j]
                  j += 1
              k += 1
          # Checking if any element was left
          while i < len(L):
              arr[k] = L[i]
              i += 1
              k += 1
          while j < len(R):
              arr[k] = R[j]
              j += 1
              k += 1
      return arr`,
    "quick-sort": `def quick_sort(arr):
      if len(arr) <= 1:
          return arr
      else:
          pivot = arr[0]
          less = [x for x in arr[1:] if x <= pivot]
          greater = [x for x in arr[1:] if x > pivot]
          return quick_sort(less) + [pivot] + quick_sort(greater)`,
    "heap-sort": `def heapify(arr, n, i):
      largest = i
      l = 2 * i + 1
      r = 2 * i + 2
      # Check if left child exists and is greater than root
      if l < n and arr[largest] < arr[l]:
          largest = l
      # Check if right child exists and is greater than root
      if r < n and arr[largest] < arr[r]:
          largest = r
      # Change root if needed
      if largest != i:
          arr[i], arr[largest] = arr[largest], arr[i]
          # Heapify the root
          heapify(arr, n, largest)
  
  def heap_sort(arr):
      n = len(arr)
      # Build a maxheap
      for i in range(n//2 - 1, -1, -1):
          heapify(arr, n, i)
      # Extract elements one by one
      for i in range(n-1, 0, -1):
          arr[i], arr[0] = arr[0], arr[i]
          heapify(arr, i, 0)
      return arr`,
    "shell-sort": `def shell_sort(arr):
      n = len(arr)
      gap = n // 2
      # Start with a big gap, then reduce the gap
      while gap > 0:
          # Do a gapped insertion sort
          for i in range(gap, n):
              temp = arr[i]
              j = i
              while j >= gap and arr[j - gap] > temp:
                  arr[j] = arr[j - gap]
                  j -= gap
              arr[j] = temp
          gap //= 2
      return arr`,
};