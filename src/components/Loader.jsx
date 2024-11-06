export const Skeleton = ({ width = "unset", length = 8 }) => {
    const skeletons = Array.from({ length }, (_, idx) => (
        <div key={idx} className="skeleton-shape"></div>

    )

    )
    return (
        <div className="skeleton-loader" style={{ width }}>
            {skeletons}
        </div>
    )
}