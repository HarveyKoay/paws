import React from 'react'
import type { Cat } from '../types/cat'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

interface CatCardProps {
  cat: Cat
  onDecision: (catId: string, liked: boolean) => void
}

const decisionThreshold = 250

const CatCard: React.FC<CatCardProps> = ({ cat, onDecision }) => {
  const safeTags = cat.tags ?? []

  // Spring values
  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: { tension: 500, friction: 50 },
  }))

  // Drag handler
  const bind = useDrag(
    ({ down, movement: [mx], velocity, args: [catId] }) => {
      const vx = velocity[0]

      const trigger =
        Math.abs(mx) > decisionThreshold ||
        (Math.abs(vx) > 0.5 && Math.abs(mx) > 50)

      if (!down && trigger) {
        const liked = mx > 0
        const dir = liked ? 1000 : -1000

        api.start({
          x: dir,
          rot: dir / 10,
          scale: 1,
          onRest: () => {
            onDecision(catId, liked)
            api.start({ x: 0, rot: 0, scale: 1 })
          },
        })

        return
      }

      api.start({
        x: down ? mx : 0,
        rot: down ? mx / 100 : 0,
        scale: down ? 1.05 : 1,
        immediate: down,
      })
    }
  )

  const opacityLike = x.to([0, decisionThreshold / 2], [0, 1])
  const opacityDislike = x.to([0, -decisionThreshold / 2], [0, 1])

  return (
    <animated.div
      {...bind(cat.id)}
      className="cat-card"
      style={{
        transform: x.to(
          (xVal) =>
            `translateX(${xVal}px) rotate(${rot.get()}deg) scale(${scale.get()})`
        ),
        touchAction: 'none',
      }}
    >
      {/* Swipe feedback */}
      <div className="swipe-feedback">
        <animated.h2 style={{ opacity: opacityLike, color: '#388e3c' }}>
          💖 LIKE
        </animated.h2>
        <animated.h2 style={{ opacity: opacityDislike, color: '#c62828' }}>
          ❌ DISLIKE
        </animated.h2>
      </div>

      {/* Cat content */}
      <img
        src={cat.url}
        alt={`A cute cat with tags: ${safeTags.join(', ')}`}
        className="cat-image"
      />

      {safeTags.length > 0 && (
        <div className="tags-container">
          {safeTags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="decision-buttons">
        <button
          className="dislike-btn"
          onClick={() => onDecision(cat.id, false)}
        >
          ❌ Dislike
        </button>
        <button
          className="like-btn"
          onClick={() => onDecision(cat.id, true)}
        >
          💖 Like
        </button>
      </div>
    </animated.div>
  )
}

export default CatCard
